import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewDto } from './dto/review.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ReviewService {
  constructor(
    private prismaService: PrismaService,
    private productService: ProductService,
  ) {}

  async getByStoreId(storeId: string) {
    return await this.prismaService.review.findMany({
      where: {
        storeId,
      },
      include: {
        user: true,
      },
    });
  }

  async getById(id: string, userId: string) {
    const review = await this.prismaService.review.findUnique({
      where: { id, userId },
      include: {
        user: true,
      },
    });

    if (!review)
      throw new NotFoundException('Відгук не знайдено або Ви не його власник');

    return review;
  }

  async create(
    userId: string,
    storeId: string,
    productId: string,
    dto: ReviewDto,
  ) {
    await this.productService.getById(productId);

    return await this.prismaService.review.create({
      data: {
        text: dto.text,
        rating: dto.rating,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        store: {
          connect: {
            id: storeId,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);

    return await this.prismaService.review.delete({
      where: {
        id,
      },
    });
  }
}
