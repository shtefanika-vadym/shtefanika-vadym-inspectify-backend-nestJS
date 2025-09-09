import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { CreateSubscriptionDto } from '@/subscription/dto/create-subscription-response.dto'

import { PrismaService } from '@/common/services/prisma.service'
import { StripeService } from '@/common/services/stripe.service'

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
  ) {}

  private async createStripeCustomerAndSubscription(
    userId: string,
    priceId: string,
  ): Promise<CreateSubscriptionDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })

    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await this.stripeService.createCustomer(user.email)
      stripeCustomerId = customer.id
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      })
    }
    const subscription = await this.stripeService.createSubscription(stripeCustomerId, priceId)
    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeSubscriptionId: subscription.id },
    })

    return {
      invoiceUrl:
        typeof subscription.latest_invoice === 'object'
          ? subscription.latest_invoice.hosted_invoice_url
          : '',
    }
  }

  async createMonthlySubscription(userId: string): Promise<CreateSubscriptionDto> {
    return this.createStripeCustomerAndSubscription(
      userId,
      this.configService.get<string>('STRIPE_MONTHLY_PRICE_ID'),
    )
  }

  async createAnnualSubscription(userId: string): Promise<CreateSubscriptionDto> {
    return this.createStripeCustomerAndSubscription(
      userId,
      this.configService.get<string>('STRIPE_ANNUAL_PRICE_ID'),
    )
  }

  async hasUserActiveSubscription(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user?.stripeSubscriptionId) return false

    const status = await this.stripeService.getSubscriptionStatus(user.stripeSubscriptionId)
    return status === 'active' || status === 'trialing'
  }
}
