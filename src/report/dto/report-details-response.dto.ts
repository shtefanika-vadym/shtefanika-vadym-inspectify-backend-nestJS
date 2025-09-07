import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { CategoryQuestionSchema } from '@/template/dto/template-response.dto'

const AnswerSchema = z.object({
  id: z.string().uuid(),
  question: CategoryQuestionSchema,
  value: z.string(),
})

const CategorySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
})

const ReportItemSchema = z.object({
  id: z.string().uuid(),
  category: CategorySchema,
  images: z.array(z.string().url()),
  comment: z.string(),
  answers: z.array(AnswerSchema),
})

export const ReportDetailsResponseSchema = z.object({
  name: z.string(),
  location: z.string(),
  createdAt: z.date(),
  reports: z.array(ReportItemSchema),
})

export class ReportDetailsResponseDto extends createZodDto(ReportDetailsResponseSchema) {}
