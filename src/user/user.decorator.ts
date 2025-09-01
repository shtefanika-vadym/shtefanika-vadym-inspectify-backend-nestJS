import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

/**
 * Retrieve user data from dto
 * @param data The property path to retrieve from user object
 * @example
 * // Get user id
 * @Post()
 * someMethod(@User('id') userId: string)
 *
 * // Get entire user object
 * @Get()
 * getUser(@User() user: User)
 */
export const User = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user

  return data ? user?.[data] : user
})
