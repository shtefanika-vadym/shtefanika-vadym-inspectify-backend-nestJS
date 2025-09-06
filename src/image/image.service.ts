import { Injectable } from '@nestjs/common'

import type { UploadImageDto } from '@/image/dto/upload-image.dto'

import { R2Service } from '@/common/services/r2.service'
import type { SuccessResponseType } from '@/common/types/success-response.type'

@Injectable()
export class ImageService {
  constructor(private readonly r2Service: R2Service) {}

  uploadImage(userId: string, file: UploadImageDto): Promise<string> {
    return this.r2Service.uploadFile(userId, file as Express.Multer.File, 'images')
  }

  async removeImage(key: string): Promise<SuccessResponseType> {
    await this.r2Service.removeFile(key, 'images')

    return { success: true }
  }
}
