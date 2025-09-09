import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { SuccessResponseDto } from '@/common/dto/success-response.dto'

import { UserResponseType } from '@/user/dto/create-user.dto'
import { User } from '@/user/user.decorator'

import { CreateReportDto } from '@/report/dto/create-report.dto'
import { ReportDetailsResponseDto } from '@/report/dto/report-details-response.dto'
import { ReportResponseDto } from '@/report/dto/report-response.dto'
import { ReportService } from '@/report/report.service'

@UseGuards(AuthGuard())
@ApiTags('reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SuccessResponseDto,
    description: 'Report created successfully.',
  })
  async createReport(
    @User() user: UserResponseType,
    @Body() dto: CreateReportDto,
  ): Promise<SuccessResponseDto> {
    return this.reportService.createReport(user.id, dto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all my reports' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ReportResponseDto],
    description: 'List of reports.',
  })
  async getMyReports(@User() user: UserResponseType): Promise<ReportResponseDto[]> {
    return this.reportService.getReportsByUser(user.id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReportDetailsResponseDto,
    description: 'Report details.',
  })
  async getReport(@Param('id') id: string): Promise<ReportDetailsResponseDto> {
    return this.reportService.getReportById(id)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a report' })
  @ApiResponse({ status: HttpStatus.OK, type: SuccessResponseDto, description: 'Report deleted' })
  async removeReport(@Param('id') id: string): Promise<SuccessResponseDto> {
    return this.reportService.removeReport(id)
  }
}
