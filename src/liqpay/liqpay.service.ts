import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class LiqpayService {
  private publicKey = process.env.LIQPAY_PUBLIC_KEY;
  private privateKey = process.env.LIQPAY_PRIVATE_KEY;

  createPaymentData(orderId: string, amount: number, currency: string = 'UAH') {
    const params = {
      public_key: this.publicKey,
      version: '3',
      action: 'pay',
      amount,
      currency,
      description: `Оплата замовлення #${orderId}`,
      order_id: orderId,
      sandbox: 1,
      result_url: `${process.env.RESULT_URL_LIQPAY}/order/${orderId}`,
      server_url: `${process.env.SERVER_URL_LIQPAY}/liqpay/callback`,
    };

    const jsonString = JSON.stringify(params);
    const data = Buffer.from(jsonString).toString('base64');
    const signature = this.generateSignature(data);

    return { data, signature };
  }

  private generateSignature(data: string): string {
    return crypto
      .createHash('sha1')
      .update(this.privateKey + data + this.privateKey)
      .digest('base64');
  }

  verifyCallback(data: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHash('sha1')
      .update(this.privateKey + data + this.privateKey)
      .digest('base64');

    return signature === expectedSignature;
  }

  // Створення форми для переходу на фронт
  createLiqPayForm(data: string, signature: string): string {
    return `
      <html>
        <body onload="document.forms[0].submit()">
          <form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
            <input type="hidden" name="data" value="${data}" />
            <input type="hidden" name="signature" value="${signature}" />
            <noscript>
              <input type="submit" value="Оплатити" />
            </noscript>
          </form>
        </body>
      </html>
    `;
  }
}
