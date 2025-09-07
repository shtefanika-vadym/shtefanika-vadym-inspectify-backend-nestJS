import { Injectable, NotFoundException } from '@nestjs/common'

import type { Prisma } from '@prisma/client'

import type { CategoryReport, Report } from 'generated/prisma'

import type { SuccessResponseDto } from '@/common/dto/success-response.dto'
import { PrismaService } from '@/common/services/prisma.service'

import type { BaseCategoryReportType, CreateReportDto } from '@/report/dto/create-report.dto'
import { ReportResponseDto } from '@/report/dto/report-response.dto'
import { ReportDetailsResponseDto } from '@/report/dto/report-details-response.dto'

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(userId: string, dto: CreateReportDto): Promise<SuccessResponseDto> {
    const template = await this.prisma.template.findUnique({
      where: { id: dto.templateId },
    })
    if (!template) throw new NotFoundException('Template not found')

    return this.prisma.$transaction(async (tx) => {
      const report = await this.createReportRecord(tx, userId, dto)
      const categoryReportIdMap = await this.createCategoryReports(tx, report.id, dto.categories)
      await this.createAnswers(tx, dto, categoryReportIdMap)

      return { success: true }
    })
  }

  private async createReportRecord(
    tx: Prisma.TransactionClient,
    userId: string,
    dto: CreateReportDto,
  ): Promise<Report> {
    return tx.report.create({
      data: {
        userId,
        name: dto.name,
        location: dto.location,
        templateId: dto.templateId,
      },
    })
  }

  private async createCategoryReports(
    tx: Prisma.TransactionClient,
    reportId: string,
    categories: BaseCategoryReportType[],
  ): Promise<Map<string, string>> {
    const categoryReportsData = categories.map((category: BaseCategoryReportType) => ({
      reportId,
      categoryId: category.categoryId,
      images: category.images,
      comment: category.comment,
    }))

    await tx.categoryReport.createMany({
      data: categoryReportsData,
    })

    const categoryReports: CategoryReport[] = await tx.categoryReport.findMany({
      where: { reportId },
    })

    return new Map(categoryReports.map((cr: CategoryReport) => [cr.categoryId, cr.id]))
  }

  private async createAnswers(
    tx: Prisma.TransactionClient,
    dto: CreateReportDto,
    categoryReportIdMap: Map<string, string>,
  ) {
    const answersData = dto.categories.flatMap((category) =>
      (category.answers || []).map((answer) => ({
        questionId: answer.questionId,
        value: String(answer.value),
        categoryReportId: categoryReportIdMap.get(category.categoryId),
      })),
    )

    if (answersData.length > 0) {
      await tx.answer.createMany({
        data: answersData,
      })
    }
  }

  async getReportsByUser(userId: string): Promise<ReportResponseDto[]> {
    return this.prisma.report.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      omit: { updatedAt: true, userId: true, deletedAt: true },
    })
  }

  async getReportById(id: string): Promise<ReportDetailsResponseDto> {
    const report = await this.prisma.report.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        name: true,
        location: true,
        createdAt: true,
        reports: {
          select: {
            id: true,
            category: {
              select: {
                id: true,
                title: true,
              },
            },
            images: true,
            comment: true,
            answers: {
              select: {
                id: true,
                question: {
                  select: {
                    id: true,
                    question: true,
                    type: true,
                  },
                },
                value: true,
              },
            },
          },
        },
      },
    })

    if (!report) throw new NotFoundException('Report not found')
    return report
  }

  async removeReport(id: string): Promise<SuccessResponseDto> {
    const report = await this.getReportById(id)
    if (!report) throw new NotFoundException('Report not found')

    await this.prisma.report.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return { success: true }
  }
}
