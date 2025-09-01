import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const SignupSchema = z.object({
  email: z.string().min(1).email(),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export class SignupDto extends createZodDto(SignupSchema) {}
