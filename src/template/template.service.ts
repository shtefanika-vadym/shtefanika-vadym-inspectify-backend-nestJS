import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { SubscriptionService } from '@/subscription/subscription.service'
import type { Prisma } from '@prisma/client'

import type { Template, Category } from 'generated/prisma'
import { TemplateStatus } from 'generated/prisma'

import type { SuccessResponseDto } from '@/common/dto/success-response.dto'
import { FileReadService } from '@/common/services/file-read.service'
import { Md5Service } from '@/common/services/md5.service'
import { OpenAIService } from '@/common/services/openai.service'
import { PrismaService } from '@/common/services/prisma.service'
import { R2Service } from '@/common/services/r2.service'

import { TemplateResponseDto } from '@/template/dto/template-response.dto'
import type { UpdateCategoryTitleDto } from '@/template/dto/update-category-title.dto'
import type { UpdateQuestionDto } from '@/template/dto/update-question.dto'
import type { UploadTemplateDto } from '@/template/dto/upload-template.dto'
import type { CategoryBaseType, QuestionBaseType } from '@/template/types/template-base.type'

@Injectable()
export class TemplateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2Service: R2Service,
    private readonly fileReadService: FileReadService,
    private readonly openAIService: OpenAIService,
    private readonly md5Service: Md5Service,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  public async uploadTemplate(
    userId: string,
    file: UploadTemplateDto,
    name: string,
  ): Promise<SuccessResponseDto> {
    const isActive = await this.subscriptionService.hasUserActiveSubscription(userId)
    if (!isActive) throw new ForbiddenException('Subscription required to upload templates.')

    const fileUrl = await this.r2Service.uploadFile(
      userId,
      file as Express.Multer.File,
      'templates',
    )

    // Check for existing template with same md5Hash
    const duplicatedTemplate = await this.duplicateTemplateIfExists(userId, file, fileUrl, name)
    if (duplicatedTemplate) return { success: true }

    const template: Template = await this.prisma.template.create({
      data: {
        userId,
        fileUrl,
        name: name,
        status: TemplateStatus.processing,
        md5Hash: this.md5Service.toMd5(file.buffer),
        templateContent: file.buffer.toString('base64'),
      },
    })

    // Thread the processing to avoid blocking the response
    this.processTemplateCategories(template.id, file.buffer)

    return { success: true }
  }

  private async getCategoriesDataForTemplate(templateId: string): Promise<CategoryBaseType[]> {
    const sourceCategories = await this.prisma.category.findMany({
      where: { templateId },
      include: { questions: true },
    })

    return sourceCategories.map(({ title, questions }) => ({
      title: title,
      questions: questions.map(({ question, type }): QuestionBaseType => ({ question, type })),
    }))
  }

  private async duplicateCategoriesAndQuestions(
    tx: Prisma.TransactionClient,
    sourceTemplateId: string,
    targetTemplateId: string,
  ) {
    const categories = await this.getCategoriesDataForTemplate(sourceTemplateId)
    const createdCategories = await this.createCategories(tx, targetTemplateId, categories)
    const allQuestions = this.prepareQuestions(createdCategories, categories)
    await this.insertQuestions(tx, allQuestions)
  }

  private async duplicateTemplateIfExists(
    userId: string,
    file: UploadTemplateDto,
    fileUrl: string,
    name: string,
  ): Promise<boolean> {
    const md5Hash = this.md5Service.toMd5(file.buffer)
    const existing = await this.prisma.template.findFirst({
      where: { md5Hash, status: TemplateStatus.succeeded },
    })
    if (!existing) return false

    return this.prisma.$transaction(async (tx) => {
      const newTemplate = await tx.template.create({
        data: {
          name,
          userId,
          fileUrl,
          md5Hash,
          status: existing.status,
          templateContent: file.buffer.toString('base64'),
        },
      })
      await this.duplicateCategoriesAndQuestions(tx, existing.id, newTemplate.id)

      return true
    })
  }

  private async processTemplateCategories(templateId: string, fileBuffer: Buffer): Promise<void> {
    try {
      const parsedContent = this.fileReadService.readTableFile(fileBuffer)
      const categories = await this.openAIService.extractTemplateCategories(parsedContent)
      await this.prisma.$transaction(async (tx) => {
        const createdCategories = await this.createCategories(tx, templateId, categories)
        const allQuestions = this.prepareQuestions(createdCategories, categories)
        await this.insertQuestions(tx, allQuestions)
        await this.updateTemplateStatus(tx, templateId, TemplateStatus.succeeded)
      })
    } catch (err) {
      await this.updateTemplateStatus(this.prisma, templateId, TemplateStatus.failed)
    }
  }

  private async createCategories(
    tx: Prisma.TransactionClient,
    templateId: string,
    categories: CategoryBaseType[],
  ): Promise<Category[]> {
    return Promise.all(
      categories.map((category) =>
        tx.category.create({
          data: {
            templateId,
            title: category.title,
          },
        }),
      ),
    )
  }

  public async getUserTemplates(userId: string): Promise<TemplateResponseDto[]> {
    return this.prisma.template.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        status: true,
        fileUrl: true,
        createdAt: true,
        categories: true,
      },
    })
  }

  public async getUserTemplateById(
    userId: string,
    templateId: string,
  ): Promise<TemplateResponseDto> {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId, userId: userId },
      select: {
        id: true,
        name: true,
        status: true,
        fileUrl: true,
        createdAt: true,
        categories: {
          select: {
            id: true,
            title: true,
            questions: {
              select: {
                id: true,
                type: true,
                question: true,
              },
            },
          },
        },
      },
    })
    if (!template) throw new NotFoundException('Template not found')

    return template
  }

  public async removeTemplate(userId: string, templateId: string): Promise<SuccessResponseDto> {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId, userId: userId },
    })
    if (!template) throw new NotFoundException('Template not found')

    await this.prisma.template.delete({
      where: { id: templateId },
    })

    return { success: true }
  }

  private prepareQuestions(
    createdCategories: Category[],
    categories: CategoryBaseType[],
  ): QuestionBaseType[] {
    return categories.flatMap((category, index) =>
      this.mapQuestionsToCreateManyData(createdCategories[index].id, category.questions),
    )
  }

  private async insertQuestions(tx: Prisma.TransactionClient, questionsData: QuestionBaseType[]) {
    if (!questionsData.length) return
    await tx.question.createMany({ data: questionsData })
  }

  private async updateTemplateStatus(
    tx: Prisma.TransactionClient,
    templateId: string,
    status: TemplateStatus,
  ) {
    await tx.template.update({
      where: { id: templateId },
      data: { status },
    })
  }

  private mapQuestionsToCreateManyData(
    categoryId: string,
    questions: QuestionBaseType[],
  ): QuestionBaseType[] {
    return questions.map((question: QuestionBaseType) => ({
      question: question.question,
      type: question.type,
      categoryId,
    }))
  }

  public async removeCategory(userId: string, categoryId: string): Promise<SuccessResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: { template: true },
    })
    if (!category || category.template.userId !== userId)
      throw new NotFoundException('Category not found')

    await this.prisma.category.delete({ where: { id: categoryId } })
    return { success: true }
  }

  public async updateCategoryTitle(
    userId: string,
    categoryId: string,
    dto: UpdateCategoryTitleDto,
  ): Promise<SuccessResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: { template: true },
    })
    if (!category || category.template.userId !== userId)
      throw new NotFoundException('Category not found')
    await this.prisma.category.update({ where: { id: categoryId }, data: { title: dto.title } })
    return { success: true }
  }

  public async removeQuestion(userId: string, questionId: string): Promise<SuccessResponseDto> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { category: { include: { template: true } } },
    })
    if (!question || question.category.template.userId !== userId)
      throw new NotFoundException('Question not found')
    await this.prisma.question.delete({ where: { id: questionId } })
    return { success: true }
  }

  public async updateQuestion(
    userId: string,
    questionId: string,
    dto: UpdateQuestionDto,
  ): Promise<SuccessResponseDto> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { category: { include: { template: true } } },
    })
    if (!question || question.category.template.userId !== userId) {
      throw new NotFoundException('Question not found')
    }
    await this.prisma.question.update({
      where: { id: questionId },
      data: dto,
    })
    return { success: true }
  }
}
