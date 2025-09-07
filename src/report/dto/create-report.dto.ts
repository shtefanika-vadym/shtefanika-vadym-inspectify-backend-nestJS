import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CategoryAnswerSchema = z.object({
  questionId: z.string().uuid(),
  value: z.union([z.string(), z.number(), z.boolean()]),
})

export const CategoryReportSchema = z.object({
  categoryId: z.string().uuid(),
  comment: z.string().optional(),
  images: z.array(z.string().url()),
  answers: z.array(CategoryAnswerSchema),
})

export const CreateReportSchema = z.object({
  templateId: z.string().uuid(),
  name: z.string().min(1),
  location: z.string().min(1),
  categories: z.array(CategoryReportSchema),
})

export type BaseCategoryReportType = z.infer<typeof CategoryReportSchema>

export class CreateReportDto extends createZodDto(CreateReportSchema) {}
