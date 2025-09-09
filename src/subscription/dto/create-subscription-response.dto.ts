import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CreateSubscriptionSchema = z.object({
  invoiceUrl: z.string().url(),
})

export class CreateSubscriptionDto extends createZodDto(CreateSubscriptionSchema) {}
