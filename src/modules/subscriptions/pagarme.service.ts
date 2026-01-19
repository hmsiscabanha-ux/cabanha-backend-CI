import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PagarmeService {
  private api = axios.create({
    baseURL: 'https://api.pagar.me/core/v5',
    headers: {
      Authorization: `Basic ${Buffer.from(
        process.env.PAGARME_API_KEY + ':',
      ).toString('base64')}`,
      'Content-Type': 'application/json',
    },
  });

  async createCustomer(data: {
    id: string;
    name: string;
    email: string;
  }) {
    const res = await this.api.post('/customers', {
      code: data.id,
      name: data.name,
      email: data.email,
    });

    return res.data;
  }

  async createSubscription(data: {
    customerId: string;
    pagarmePlanId: string;
    cardToken: string;
  }) {
    const res = await this.api.post('/subscriptions', {
      customer_id: data.customerId,
      plan_id: data.pagarmePlanId,
      payment_method: 'credit_card',
      card: {
        token: data.cardToken,
      },
    });

    return res.data;
  }
}
