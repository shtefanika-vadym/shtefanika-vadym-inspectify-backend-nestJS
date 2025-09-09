import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { SubscriptionService } from '@/subscription/subscription.service'

import { FileReadService } from '@/common/services/file-read.service'
import { Md5Service } from '@/common/services/md5.service'
import { OpenAIService } from '@/common/services/openai.service'
import { PrismaService } from '@/common/services/prisma.service'
import { R2Service } from '@/common/services/r2.service'
import { StripeService } from '@/common/services/stripe.service'

import { TemplateController } from '@/template/template.controller'
import { TemplateService } from '@/template/template.service'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    Md5Service,
    R2Service,
    TemplateService,
    PrismaService,
    FileReadService,
    OpenAIService,
    SubscriptionService,
    StripeService,
  ],
  exports: [TemplateService],
  controllers: [TemplateController],
})
export class TemplateModule {}
