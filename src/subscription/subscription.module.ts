import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { SubscriptionController } from '@/subscription/subscription.controller'
import { SubscriptionService } from '@/subscription/subscription.service'

import { PrismaService } from '@/common/services/prisma.service'
import { StripeService } from '@/common/services/stripe.service'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [PrismaService, StripeService, SubscriptionService],
  exports: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
