import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
})

export type UserResponseType = z.infer<typeof UserSchema>

export class CreateUserDto extends createZodDto(UserSchema) {}
