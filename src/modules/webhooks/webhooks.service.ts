import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  async handlePagarme(signature: string, payload: any) {
    // 1️⃣ Validar assinatura
    this.validateSignature(signature, payload);

    const eventType = payload.type;
    const pagarmeSubId = payload.data?.id;

    if (!pagarmeSubId) return;

    // 2️⃣ Idempotência
    const alreadyProcessed = await this.prisma.webhookEvent.findUnique({
      where: { pagarmeEventId: payload.id },
    });

    if (alreadyProcessed) return;

    // 3️⃣ Busca assinatura
    const subscription = await this.prisma.subscription.findFirst({
      where: { pagarmeSubId },
    });

    if (!subscription) return;

    // 4️⃣ Processa evento
    switch (eventType) {
      case 'subscription_paid':
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'ACTIVE' },
        });
        break;

      case 'subscription_payment_failed':
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'PAST_DUE' },
        });
        break;

      case 'subscription_canceled':
      case 'subscription_suspended':
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'CANCELED' },
        });
        break;
    }

    // 5️⃣ Marca evento como processado
    await this.prisma.webhookEvent.create({
      data: {
        pagarmeEventId: payload.id,
        type: eventType,
      },
    });
  }

  private validateSignature(signature: string, payload: any) {
    const secret = process.env.PAGARME_WEBHOOK_SECRET;
    if (!secret) return; // opcional em dev

    const hash = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (`sha256=${hash}` !== signature) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }
}
