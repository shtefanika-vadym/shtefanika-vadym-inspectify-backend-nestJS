import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { PrismaService } from '@/common/services/prisma.service'

import { UserController } from '@/user/user.controller'
import { UserService } from '@/user/user.service'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [UserService, PrismaService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
