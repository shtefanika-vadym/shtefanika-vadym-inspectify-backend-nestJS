import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const SubscriptionStatusSchema = z.object({
  active: z.boolean(),
})

export class SubscriptionStatusDto extends createZodDto(SubscriptionStatusSchema) {}
