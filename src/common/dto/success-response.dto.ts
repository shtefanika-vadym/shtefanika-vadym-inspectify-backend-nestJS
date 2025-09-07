import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const SuccessResponseSchema = z.object({
  success: z.boolean(),
})

export class SuccessResponseDto extends createZodDto(SuccessResponseSchema) {}
