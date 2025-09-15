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
  Body,
  Patch,
  ForbiddenException,
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

import { SuccessResponseDto } from '@/common/dto/success-response.dto'

import { UserResponseType } from '@/user/dto/create-user.dto'
import { User } from '@/user/user.decorator'

import { TemplateResponseDto } from '@/template/dto/template-response.dto'
import { UpdateCategoryTitleDto } from '@/template/dto/update-category-title.dto'
import { UpdateQuestionDto } from '@/template/dto/update-question.dto'
import { UploadTemplateDto } from '@/template/dto/upload-template.dto'
import { TemplateService } from '@/template/template.service'

@UseGuards(AuthGuard())
@ApiTags('templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post('upload')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a template (xlsx/csv)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SuccessResponseDto,
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
        name: {
          type: 'string',
          description: 'Name of the template',
        },
      },
      required: ['file', 'name'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadTemplate(
    @User() user: UserResponseType,
    @UploadedFile() file: UploadTemplateDto,
    @Body('name') name: string,
  ): Promise<SuccessResponseDto> {
    return this.templateService.uploadTemplate(user.id, file, name)
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user templates' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TemplateResponseDto],
    description: 'List of user templates',
  })
  async getTemplates(@User() user: UserResponseType): Promise<TemplateResponseDto[]> {
    return this.templateService.getUserTemplates(user.id)
  }

  @Get(':templateId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user template' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TemplateResponseDto,
    description: 'Template received successfully',
  })
  async getTemplateById(
    @User() user: UserResponseType,
    @Param('templateId') templateId: string,
  ): Promise<UserResponseType> {
    return this.templateService.getUserTemplateById(user.id, templateId)
  }

  @Delete(':templateId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a user template' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDto,
    description: 'Template removed successfully',
  })
  async removeTemplate(
    @User() user: UserResponseType,
    @Param('templateId') templateId: string,
  ): Promise<SuccessResponseDto> {
    return this.templateService.removeTemplate(user.id, templateId)
  }

  @Delete('category/:categoryId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a category from a template' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDto,
    description: 'Category removed successfully',
  })
  async removeCategory(
    @User() user: UserResponseType,
    @Param('categoryId') categoryId: string,
  ): Promise<SuccessResponseDto> {
    return this.templateService.removeCategory(user.id, categoryId)
  }

  @Patch('category/:categoryId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category title' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDto,
    description: 'Category title updated successfully',
  })
  async updateCategoryTitle(
    @User() user: UserResponseType,
    @Param('categoryId') categoryId: string,
    @Body() dto: UpdateCategoryTitleDto,
  ): Promise<SuccessResponseDto> {
    return this.templateService.updateCategoryTitle(user.id, categoryId, dto)
  }

  @Delete('question/:questionId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a question from a template' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDto,
    description: 'Question removed successfully',
  })
  async removeQuestion(
    @User() user: UserResponseType,
    @Param('questionId') questionId: string,
  ): Promise<SuccessResponseDto> {
    return this.templateService.removeQuestion(user.id, questionId)
  }

  @Patch('question/:questionId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update question' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDto,
    description: 'Question updated successfully',
  })
  async updateQuestion(
    @User() user: UserResponseType,
    @Param('questionId') questionId: string,
    @Body() dto: UpdateQuestionDto,
  ): Promise<SuccessResponseDto> {
    return this.templateService.updateQuestion(user.id, questionId, dto)
  }
}
