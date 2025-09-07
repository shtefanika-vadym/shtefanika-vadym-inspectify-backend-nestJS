import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const UpdateCategoryTitleSchema = z.object({
  title: z.string(),
})

export class UpdateCategoryTitleDto extends createZodDto(UpdateCategoryTitleSchema) {}
