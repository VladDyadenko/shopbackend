import { Injectable } from '@nestjs/common';

import * as dayjs from 'dayjs';
import 'dayjs/locale/ua';
import { PrismaService } from 'src/prisma.service';

dayjs.locale('ua');

const monthNames = [
  'січ',
  'лют',
  'бер',
  'кві',
  'тра',
  'чер',
  'лип',
  'сер',
  'вер',
  'жов',
  'лис',
  'гру',
];

@Injectable()
export class StatisticsService {
  constructor(private prismaService: PrismaService) {}

  async getMainStatistics(storeId: string) {
    const totalRevenue = await this.calculateTotalRevenue(storeId);

    const productsCountss = await this.countProducts(storeId);
    const categoriesCount = await this.countCategories(storeId);

    const averageRating = await this.calculateAverageRating(storeId);

    return [
      { id: 1, name: 'Виручка', value: totalRevenue },
      { id: 2, name: 'Товари', value: productsCountss },
      { id: 3, name: 'Категорії', value: categoriesCount },
      { id: 4, name: 'Середній рейтинг', value: averageRating },
    ];
  }

  async getMiddleStatistics(storeId: string) {
    const monthlySales = await this.calculateMonthlySales(storeId);
    const lastUsers = await this.getLastUsers(storeId);

    return { monthlySales, lastUsers };
  }

  private async calculateTotalRevenue(storeId: string) {
    const orders = await this.prismaService.order.findMany({
      where: {
        items: {
          some: { id: storeId },
        },
      },
      include: {
        items: {
          where: { storeId },
        },
      },
    });

    const totalRevenue = orders.reduce((acc, order) => {
      const total = order.items.reduce((itemAcc, item) => {
        return itemAcc + item.price * item.quantity;
      }, 0);
      return acc + total;
    }, 0);

    return totalRevenue;
  }

  private async countProducts(storeId: string) {
    return await this.prismaService.product.count({
      where: { storeId },
    });
  }

  private async countCategories(storeId: string) {
    return await this.prismaService.category.count({
      where: { storeId },
    });
  }

  private async calculateAverageRating(storeId: string) {
    const avaregeRating = await this.prismaService.review.aggregate({
      where: { storeId },
      _avg: { rating: true },
    });

    return avaregeRating._avg.rating;
  }

  private async calculateMonthlySales(storeId: string) {
    const startDate = dayjs().subtract(30, 'days').startOf('day').toDate();
    const endDate = dayjs().endOf('day').toDate();

    const salesRaw = await this.prismaService.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        items: {
          some: { storeId },
        },
      },
      include: {
        items: true,
      },
    });

    const formatDate = (date: Date): string => {
      return `${date.getDate()} ${monthNames[date.getMonth()]}`;
    };

    const salesByDate = new Map<string, number>();

    salesRaw.forEach((order) => {
      const formattedDate = formatDate(new Date(order.createdAt));

      const total = order.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      if (salesByDate.has(formattedDate)) {
        salesByDate.set(formattedDate, salesByDate.get(formattedDate) + total);
      } else {
        salesByDate.set(formattedDate, total);
      }
    });

    const monthlySales = Array.from(salesByDate, ([date, value]) => ({
      date,
      value,
    }));

    return monthlySales;
  }

  private async getLastUsers(storeId: string) {
    const lastUsers = await this.prismaService.user.findMany({
      where: {
        orders: {
          some: {
            items: {
              some: { storeId },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        orders: {
          where: {
            items: { some: { storeId } },
          },
          include: {
            items: {
              where: { storeId },
              select: { price: true },
            },
          },
        },
      },
    });

    return lastUsers.map((user) => {
      const lastOrder = user.orders[user.orders.length - 1];

      const total = lastOrder.items.reduce((total, item) => {
        return total + item.price;
      }, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        total,
      };
    });
  }
}
