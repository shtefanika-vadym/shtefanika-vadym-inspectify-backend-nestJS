import type { QuestionType } from 'generated/prisma'

export type QuestionBaseType = {
  question: string
  type: QuestionType
}

export type CategoryBaseType = {
  title: string
  questions: QuestionBaseType[]
}
