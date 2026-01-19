import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PagarmeService } from './pagarme.service';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, PagarmeService],
})
export class SubscriptionsModule {}
