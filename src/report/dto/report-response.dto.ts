import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { CreateReportSchema } from '@/report/dto/create-report.dto'

export const ReportResponseSchema = CreateReportSchema.omit({ categories: true }).extend({
  id: z.string().uuid(),
  createdAt: z.date(),
})

export class ReportResponseDto extends createZodDto(ReportResponseSchema) {}
