import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateUserDto, UserResponseType } from '@/user/dto/create-user.dto'
import { User } from '@/user/user.decorator'
import { UserService } from '@/user/user.service'

@UseGuards(AuthGuard())
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateUserDto,
    description: 'Profile retrieved successfully',
  })
  async getProfile(@User() user: UserResponseType) {
    return this.userService.getUserEntityById(user.id)
  }
}
