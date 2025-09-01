import { Injectable, NotFoundException } from '@nestjs/common'

import type { Template } from 'generated/prisma'
import { TemplateStatus } from 'generated/prisma'

import { FileReadService } from '@/common/services/file-read.service'
import { Md5Service } from '@/common/services/md5.service'
import { OpenAIService } from '@/common/services/openai.service'
import { PrismaService } from '@/common/services/prisma.service'
import { R2Service } from '@/common/services/r2.service'
import type { SuccessResponseType } from '@/common/types/success-response.type'

import type { UserResponseType } from '@/user/dto/create-user.dto'
import type { UploadTemplateDto } from '@/user/dto/upload-template.dto'
import type { TemplateResponseDto } from 'src/user/dto/template-response.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2Service: R2Service,
    private readonly fileReadService: FileReadService,
    private readonly openAIService: OpenAIService,
    private readonly md5Service: Md5Service,
  ) {}

  public async getUserEntityById(id: string): Promise<UserResponseType> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, templates: true },
    })
  }

  private uploadR2TemplateFile(userId: string, file: UploadTemplateDto): Promise<string> {
    const fileExtension = this.fileReadService.getFileExtension(file.originalname)

    const key = `${userId}/${Date.now()}.${fileExtension}`
    return this.r2Service.uploadFile(key, file.buffer, 'templates')
  }

  public async uploadTemplate(userId: string, file: UploadTemplateDto): Promise<Template> {
    const fileUrl = await this.uploadR2TemplateFile(userId, file)

    // Check for existing template with same md5Hash
    const duplicatedTemplate = await this.duplicateTemplateIfExists(userId, file, fileUrl)
    if (duplicatedTemplate) return duplicatedTemplate

    const template: Template = await this.prisma.template.create({
      data: {
        userId,
        fileUrl,
        categories: [],
        status: TemplateStatus.processing,
        md5Hash: this.md5Service.toMd5(file.buffer),
        templateContent: file.buffer.toString('base64'),
      },
    })

    // Thread the processing to avoid blocking the response
    this.processTemplateCategories(template.id, file.buffer)

    return template
  }

  private async duplicateTemplateIfExists(
    userId: string,
    file: UploadTemplateDto,
    fileUrl: string,
  ): Promise<Template | null> {
    const md5Hash = this.md5Service.toMd5(file.buffer)
    const existing = await this.prisma.template.findFirst({
      where: { md5Hash, status: TemplateStatus.succeeded },
    })

    if (!existing) return null

    // Duplicate categories/status from existing template
    return this.prisma.template.create({
      data: {
        userId,
        fileUrl,
        md5Hash,
        status: existing.status,
        categories: existing.categories,
        templateContent: file.buffer.toString('base64'),
      },
    })
  }

  private async processTemplateCategories(templateId: string, fileBuffer: Buffer): Promise<void> {
    let categories = []
    let status: TemplateStatus
    try {
      const parsedContent: string = this.fileReadService.readTableFile(fileBuffer)

      categories = await this.openAIService.extractTemplateCategories(parsedContent)
      status = TemplateStatus.succeeded
    } catch (err) {
      status = TemplateStatus.failed
    }

    // Update template with questions and final status
    await this.prisma.template.update({
      where: { id: templateId },
      data: {
        status,
        categories,
      },
    })
  }

  public async getUserTemplates(userId: string): Promise<TemplateResponseDto[]> {
    const templates = await this.prisma.template.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      omit: { templateContent: true },
    })
    return templates as TemplateResponseDto[]
  }

  public async removeTemplate(userId: string, templateId: string): Promise<SuccessResponseType> {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
    })
    if (!template || template.userId !== userId) throw new NotFoundException('Template not found')

    await this.prisma.template.delete({
      where: { id: templateId },
    })

    return { success: true }
  }
}
