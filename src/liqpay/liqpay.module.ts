import { Module } from '@nestjs/common';
import { LiqpayService } from './liqpay.service';
import { LiqpayController } from './liqpay.controller';
import { OrderModule } from 'src/order/order.module';

@Module({
  controllers: [LiqpayController],
  providers: [LiqpayService],
  imports: [OrderModule],
})
export class LiqpayModule {}
