import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const LoginSchema = z.object({
  token: z.string(),
})

export class LoginResponseDto extends createZodDto(LoginSchema) {
  constructor(token: string) {
    super()
    this.token = token
  }
}
