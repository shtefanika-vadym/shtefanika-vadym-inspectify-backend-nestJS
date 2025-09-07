import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { PrismaService } from '@/common/services/prisma.service'

import { ReportController } from '@/report/report.controller'
import { ReportService } from '@/report/report.service'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ReportController],
  providers: [ReportService, PrismaService],
  exports: [ReportService],
})
export class ReportModule {}
