import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { ImageService } from '@/image/image.service'
import { ImageController } from 'src/image/image.controller'

import { R2Service } from 'src/common/services/r2.service'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ImageController],
  providers: [ImageService, R2Service],
  exports: [ImageService],
})
export class ImageModule {}
