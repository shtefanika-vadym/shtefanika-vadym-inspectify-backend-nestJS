import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { ImageController } from '@/image/image.controller'
import { ImageService } from '@/image/image.service'

import { R2Service } from '@/common/services/r2.service'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ImageController],
  providers: [ImageService, R2Service],
  exports: [ImageService],
})
export class ImageModule {}
