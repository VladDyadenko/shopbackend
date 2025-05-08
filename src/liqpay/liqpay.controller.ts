import { Body, Controller, Logger, Post } from '@nestjs/common';
import { LiqpayService } from './liqpay.service';

@Controller('liqpay')
export class LiqpayController {
  private readonly logger = new Logger(LiqpayController.name);
  constructor(private readonly liqpayService: LiqpayService) {}

  @Post('callback')
  handleCallback(@Body() body: { data: string; signature: string }) {
    try {
      // this.logger.log('Отримано callback від LiqPay', { data: body.data });

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
        // await this.orderService.confirmOrder(paymentData.order_id, paymentData);
      } else {
        this.logger.warn(
          `Невідомий статус платежу: ${paymentData.status}`,
          paymentData,
        );
      }

      return { status: 'ok' }; // Важливо! LiqPay чекає 200 OK
    } catch (error) {
      this.logger.error('Помилка обробки callback', {
        error: error.message,
        stack: error.stack,
        body, // Логуємо вхідні дані для діагностики
      });
      throw error; // Повертаємо 500, щоб LiqPay повторив спробу
    }
  }
}
