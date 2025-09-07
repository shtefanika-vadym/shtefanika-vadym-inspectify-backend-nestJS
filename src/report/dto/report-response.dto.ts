import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const ReportResponseSchema = z.object({
  id: z.string().uuid(),
  templateId: z.string().uuid(),
  name: z.string(),
  location: z.string(),
  createdAt: z.date(),
})

export class ReportResponseDto extends createZodDto(ReportResponseSchema) {}
