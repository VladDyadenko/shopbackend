import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma.service';
import { LiqpayService } from 'src/liqpay/liqpay.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, LiqpayService],
})
export class OrderModule {}
