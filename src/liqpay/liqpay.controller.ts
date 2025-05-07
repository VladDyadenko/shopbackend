import { Body, Controller, Post } from '@nestjs/common';
import { LiqpayService } from './liqpay.service';

@Controller('liqpay')
export class LiqpayController {
  constructor(private readonly liqpayService: LiqpayService) {}

  @Post('callback')
  handleCallback(@Body() body: { data: string; signature: string }) {
    const isValid = this.liqpayService.verifyCallback(
      body.data,
      body.signature,
    );

    if (!isValid) {
      throw new Error('Invalid LiqPay signature');
    }

    const paymentData = JSON.parse(Buffer.from(body.data, 'base64').toString());
    const { status } = paymentData;

    if (status === 'success' || status === 'sandbox') {
      // Оновлюємо статус замовлення в базі
      // await this.orderService.confirmOrder(order_id)
    }

    return { status: 'ok' };
  }
}
