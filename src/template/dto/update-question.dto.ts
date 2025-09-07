import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { QuestionType } from 'generated/prisma'

export const UpdateQuestionSchema = z.object({
  question: z.string(),
  type: z.nativeEnum(QuestionType),
})

export class UpdateQuestionDto extends createZodDto(UpdateQuestionSchema) {}
