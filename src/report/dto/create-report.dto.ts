import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CategoryAnswerSchema = z.object({
  question: z.string().min(1),
  answer: z.union([z.string(), z.number(), z.boolean()]),
})

export const CategoryReportSchema = z.object({
  title: z.string().min(1),
  comment: z.string().optional(),
  images: z.array(z.string().url()),
  answers: z.array(CategoryAnswerSchema),
})

export const CreateReportSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  categories: z.array(CategoryReportSchema),
})

export class CreateReportDto extends createZodDto(CreateReportSchema) {}
