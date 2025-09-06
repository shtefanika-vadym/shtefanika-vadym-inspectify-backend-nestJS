import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { UploadImageDto } from '@/image/dto/upload-image.dto'
import { ImageService } from '@/image/image.service'

import type { SuccessResponseType } from '@/common/types/success-response.type'

import { UserResponseType } from '@/user/dto/create-user.dto'
import { User } from '@/user/user.decorator'

@UseGuards(AuthGuard())
@ApiTags('images')
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload an image' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Image uploaded',
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
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @User() user: UserResponseType,
    @UploadedFile() file: UploadImageDto,
  ): Promise<string> {
    return this.imageService.uploadImage(user.id, file)
  }

  @Delete(':key')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove an image' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image removed successfully',
  })
  async removeImage(@Param('key') key: string): Promise<SuccessResponseType> {
    return this.imageService.removeImage(key)
  }
}
