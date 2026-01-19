import { Controller, Post, Headers, Body, HttpCode } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('pagarme')
  @HttpCode(200)
  async handlePagarme(
    @Headers('x-hub-signature') signature: string,
    @Body() payload: any,
  ) {
    await this.webhooksService.handlePagarme(signature, payload);
    return { received: true };
  }
}
