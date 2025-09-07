import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { TemplateStatus, QuestionType } from 'generated/prisma'

export const CategoryQuestionSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(QuestionType),
  question: z.string().min(1),
})

const TemplateCategorySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  questions: z.array(CategoryQuestionSchema),
})

export const TemplateResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  fileUrl: z.string().url(),
  categories: z.array(TemplateCategorySchema),
  status: z.nativeEnum(TemplateStatus),
  createdAt: z.date(),
})

export type TemplateCategoryType = z.infer<typeof TemplateCategorySchema>

export class TemplateResponseDto extends createZodDto(TemplateResponseSchema) {}
