import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { TemplateStatus } from 'generated/prisma'

const CategorySchema = z.object({
  title: z.string(),
  questions: z.array(z.string()),
})

export const TemplateResponseSchema = z.object({
  id: z.string().uuid(),
  fileUrl: z.string().url(),
  categories: z.array(CategorySchema),
  status: z.nativeEnum(TemplateStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export class TemplateResponseDto extends createZodDto(TemplateResponseSchema) {}
