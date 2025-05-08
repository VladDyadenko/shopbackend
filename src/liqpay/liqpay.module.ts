import { Module } from '@nestjs/common';
import { LiqpayService } from './liqpay.service';
import { LiqpayController } from './liqpay.controller';
import { OrderService } from 'src/order/order.service';

@Module({
  controllers: [LiqpayController],
  providers: [LiqpayService, OrderService],
})
export class LiqpayModule {}
