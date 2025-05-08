import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './dto/order.dto';
import { LiqpayService } from 'src/liqpay/liqpay.service';
import { LiqPayCallbackDto } from './dto/payment-status.dto';
import { EnumOrderStatus } from 'generated/prisma';

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

    // Створення форми для переходу на фронт ТЕСТОВЕ, в продакшн не потрібно!!!
    const html = this.liqPayService.createLiqPayForm(data, signature);

    return {
      order,
      paymentData,
      //   в продакшн не потрібно
      html,
    };
  }

  async confirmOrder(dto: LiqPayCallbackDto) {
    await this.prismaService.order.update({
      where: { id: dto.order_id },
      data: {
        status: EnumOrderStatus.PAYED,
      },
    });
  }

  async failOrder(dto: LiqPayCallbackDto) {
    await this.prismaService.order.update({
      where: { id: dto.order_id },
      data: {
        status: EnumOrderStatus.PENDING,
      },
    });
  }
}
