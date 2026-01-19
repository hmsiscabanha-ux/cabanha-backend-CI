import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class PagarmeWebhookService {
  constructor(private prisma: PrismaService) {}

  async handle(event: any) {
    const type = event.type;

    switch (type) {
      case 'subscription_paid':
        // atualizar para ACTIVE
        break;

      case 'subscription_payment_failed':
        // marcar como PAST_DUE
        break;

      case 'subscription_canceled':
        // cancelar
        break;

      default:
        break;
    }
  }
}
