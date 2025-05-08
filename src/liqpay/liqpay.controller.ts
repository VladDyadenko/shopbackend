import { Body, Controller, Logger, Post } from '@nestjs/common';
import { LiqpayService } from './liqpay.service';
import { OrderService } from 'src/order/order.service';

@Controller('liqpay')
export class LiqpayController {
  private readonly logger = new Logger(LiqpayController.name);
  constructor(
    private readonly liqpayService: LiqpayService,
    private orderService: OrderService,
  ) {}

  @Post('callback')
  async handleCallback(@Body() body: { data: string; signature: string }) {
    try {
      // Перевірка підпису
      const isValid = this.liqpayService.verifyCallback(
        body.data,
        body.signature,
      );
      if (!isValid) {
        this.logger.error('Невірний підпис LiqPay', { data: body.data });
        throw new Error('Invalid LiqPay signature');
      }

      // Розкодування даних
      const paymentData = JSON.parse(
        Buffer.from(body.data, 'base64').toString(),
      );
      // this.logger.debug('Розкодовані дані платежу', paymentData);

      // Обробка статусу
      if (
        paymentData.status === 'success' ||
        paymentData.status === 'sandbox'
      ) {
        this.logger.log(
          `Успішний платіж для замовлення ${paymentData.order_id}`,
        );
        // Тут оновлюємо статус замовлення в базі
        await this.orderService.confirmOrder(paymentData);
      } else if (paymentData.status === 'failure') {
        this.logger.warn(
          `Платіж НЕ вдалий для замовлення ${paymentData.order_id}`,
          paymentData,
        );

        await this.orderService.failOrder(paymentData);
      } else if (paymentData.status === 'reversed') {
        this.logger.warn(
          `Платіж ПОВЕРНЕНИЙ для замовлення ${paymentData.order_id}`,
          paymentData,
        );

        await this.orderService.failOrder(paymentData);
      } else if (paymentData.status === 'error') {
        this.logger.error(
          `LiqPay повернув статус ERROR для замовлення ${paymentData.order_id}`,
          paymentData,
        );

        await this.orderService.failOrder(paymentData);
      }

      return { status: 'ok' };
    } catch (error) {
      this.logger.error('Помилка обробки callback', {
        error: error.message,
        stack: error.stack,
        body,
      });
      throw error; // Повертаємо 500, щоб LiqPay повторив спробу
    }
  }
}
