import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { CreateReportSchema } from '@/report/dto/create-report.dto'

export const ReportDetailsResponseSchema = CreateReportSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
})

export class ReportDetailsResponseDto extends createZodDto(ReportDetailsResponseSchema) {}
