import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './dto/order.dto';
import { LiqpayService } from 'src/liqpay/liqpay.service';

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaService,
    private liqPayService: LiqpayService,
  ) {}

  async createPayment(dto: OrderDto, userId: string) {
    const orderItems = dto.items.map((item) => ({
      product: {
        connect: {
          id: item.productId,
        },
      },
      store: {
        connect: {
          id: item.storeId,
        },
      },
      quantity: item.quantity,
      price: item.price,
    }));
    const total = dto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const order = await this.prismaService.order.create({
      data: {
        status: dto.status,
        items: {
          create: orderItems,
        },
        total,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    const paymentData = this.liqPayService.createPaymentData(order.id, total);
    const { data, signature } = paymentData;
    const html = this.liqPayService.createLiqPayForm(data, signature);

    return {
      order,
      paymentData,
      html,
    };
  }
}
