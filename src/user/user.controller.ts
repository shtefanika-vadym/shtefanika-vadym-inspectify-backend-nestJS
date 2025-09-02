import {
  Controller,
  Get,
  HttpStatus,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  Param,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger'

import type { Template } from 'generated/prisma'

import type { SuccessResponseType } from '@/common/types/success-response.type'

import { CreateUserDto, UserResponseType } from '@/user/dto/create-user.dto'
import { TemplateResponseDto } from '@/user/dto/template-response.dto'
import { UploadTemplateDto } from '@/user/dto/upload-template.dto'
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

  @Post('templates/upload')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a template (xlsx/csv)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Template uploaded and processed',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadTemplate(
    @User() user: UserResponseType,
    @UploadedFile() file: UploadTemplateDto,
  ): Promise<Template> {
    return this.userService.uploadTemplate(user.id, file)
  }

  @Get('templates')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user templates' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TemplateResponseDto],
    description: 'List of user templates',
  })
  async getTemplates(@User() user: UserResponseType): Promise<TemplateResponseDto[]> {
    return this.userService.getUserTemplates(user.id)
  }

  @Delete('templates/:templateId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a user template' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Template removed successfully',
  })
  async removeTemplate(
    @User() user: UserResponseType,
    @Param('templateId') templateId: string,
  ): Promise<SuccessResponseType> {
    return this.userService.removeTemplate(user.id, templateId)
  }
}
