import { Controller, Get, HttpStatus, UseGuards, Post } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateSubscriptionDto } from '@/subscription/dto/create-subscription-response.dto'
import { SubscriptionStatusDto } from '@/subscription/dto/subscription-status-response.dto'
import { SubscriptionService } from '@/subscription/subscription.service'

import { UserResponseType } from '@/user/dto/create-user.dto'
import { User } from '@/user/user.decorator'

@UseGuards(AuthGuard())
@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('monthly')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe monthly (100 RON)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateSubscriptionDto,
    description: 'Subscription created successfully',
  })
  async subscribeMonthly(@User() user: UserResponseType): Promise<CreateSubscriptionDto> {
    return this.subscriptionService.createMonthlySubscription(user.id)
  }

  @Post('annual')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe annually (1000 RON)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateSubscriptionDto,
    description: 'Subscription created successfully',
  })
  async subscribeAnnual(@User() user: UserResponseType): Promise<CreateSubscriptionDto> {
    return this.subscriptionService.createAnnualSubscription(user.id)
  }

  @Get('status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check subscription status' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SubscriptionStatusDto,
    description: 'Category removed successfully',
  })
  async subscriptionStatus(@User() user: UserResponseType): Promise<SubscriptionStatusDto> {
    const active = await this.subscriptionService.hasUserActiveSubscription(user.id)
    return { active }
  }
}
