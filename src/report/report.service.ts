import { Injectable, NotFoundException } from '@nestjs/common'

import type { SuccessResponseDto } from '@/common/dto/success-response.dto'
import { PrismaService } from '@/common/services/prisma.service'

import type { CreateReportDto } from '@/report/dto/create-report.dto'
import type { ReportDetailsResponseDto } from '@/report/dto/report-details-response.dto'
import type { ReportResponseDto } from '@/report/dto/report-response.dto'

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(userId: string, dto: CreateReportDto): Promise<SuccessResponseDto> {
    await this.prisma.report.create({
      data: {
        userId,
        name: dto.name,
        location: dto.location,
        categories: dto.categories,
      },
    })
    return { success: true }
  }

  async getReportsByUser(userId: string): Promise<ReportResponseDto[]> {
    return this.prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      omit: { userId: true, categories: true },
    })
  }

  async getReportById(id: string): Promise<ReportDetailsResponseDto> {
    const report = (await this.prisma.report.findFirst({
      where: { id },
      omit: { userId: true },
    })) as ReportDetailsResponseDto

    if (!report) throw new NotFoundException('Report not found')
    return report
  }

  async removeReport(id: string): Promise<SuccessResponseDto> {
    const report = await this.getReportById(id)
    if (!report) throw new NotFoundException('Report not found')

    await this.prisma.report.delete({
      where: { id },
    })

    return { success: true }
  }
}
