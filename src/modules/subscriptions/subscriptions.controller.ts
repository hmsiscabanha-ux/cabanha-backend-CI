import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribe(
    @CurrentUser() user: any,
    @Body() body: { planId: string; cardToken: string },
  ) {
    return this.subscriptionsService.subscribe(user.userId, body);
  }
}
