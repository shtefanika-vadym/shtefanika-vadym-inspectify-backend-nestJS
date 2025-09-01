import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { FileReadService } from '@/common/services/file-read.service'
import { Md5Service } from '@/common/services/md5.service'
import { OpenAIService } from '@/common/services/openai.service'
import { PrismaService } from '@/common/services/prisma.service'
import { R2Service } from '@/common/services/r2.service'

import { UserController } from '@/user/user.controller'
import { UserService } from '@/user/user.service'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [Md5Service, R2Service, UserService, PrismaService, FileReadService, OpenAIService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
