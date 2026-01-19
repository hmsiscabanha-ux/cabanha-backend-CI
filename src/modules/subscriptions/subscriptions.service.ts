import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PagarmeService } from './pagarme.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagarmeService: PagarmeService,
  ) {}

  async subscribe(
    userId: string,
    data: { planId: string; cardToken: string },
  ) {
    // 1️⃣ Busca usuário
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // 2️⃣ Busca plano
    const plan = await this.prisma.plan.findUnique({
      where: { id: data.planId },
    });

    if (!plan || !plan.active) {
      throw new BadRequestException('Plano inválido');
    }

    // 3️⃣ Cria cliente no Pagar.me
    const customer = await this.pagarmeService.createCustomer({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    // 4️⃣ Cria assinatura no Pagar.me
    const pagarmeSubscription =
      await this.pagarmeService.createSubscription({
        customerId: customer.id,
        pagarmePlanId: plan.pagarmePlanId,
        cardToken: data.cardToken,
      });

    // 5️⃣ Salva assinatura como PAST_DUE
    return this.prisma.subscription.upsert({
      where: { userId },
      update: {
        pagarmeSubId: pagarmeSubscription.id,
        status: 'PAST_DUE',
        planId: plan.id,
      },
      create: {
        userId,
        planId: plan.id,
        pagarmeSubId: pagarmeSubscription.id,
        status: 'PAST_DUE',
      },
    });
  }
}
