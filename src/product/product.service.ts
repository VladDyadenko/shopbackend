import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/product-update.dto';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) return this.getSearchTermFilter(searchTerm);

    return this.prismaService.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
  }

  private async getSearchTermFilter(searchTerm: string) {
    return await this.prismaService.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async getByStoreId(storeId: string) {
    return await this.prismaService.product.findMany({
      where: {
        storeId,
      },
      include: {
        category: true,
        color: true,
      },
    });
  }

  async getById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: {
        category: true,
        color: true,
        reviews: true,
      },
    });

    if (!product) throw new NotFoundException('Такий товар не знайдено');

    return product;
  }

  async getByCategory(categoryId: string) {
    const products = await this.prismaService.product.findMany({
      where: {
        category: {
          id: categoryId,
        },
      },
      include: {
        category: true,
      },
    });

    if (!products) throw new NotFoundException('Товари не знайдені');

    return products;
  }

  // Популярні товари
  async getMostPopular() {
    const mostPopularProducts = await this.prismaService.orderItem.groupBy({
      by: ['productId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    const productIds = mostPopularProducts.map((item) => item.productId);

    const products = await this.prismaService.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        category: true,
      },
    });
    return products;
  }

  // Вивід тільки потрібних полів =>
  // include: {
  // 	category: {
  // 		select: {
  // 			title: true
  // 		}
  // 	}
  // }
  // Схожи товари
  async getSimilar(id: string) {
    const currentProduct = await this.getById(id);

    if (!currentProduct)
      throw new NotFoundException('Поточний товар не знайдений');

    const products = await this.prismaService.product.findMany({
      where: {
        category: {
          title: currentProduct.category.title,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
    return products;
  }

  async create(storeId: string, dto: CreateProductDto) {
    return await this.prismaService.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        images: dto.images,
        categoryId: dto.categoryId,
        colorId: dto.colorId,
        storeId,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.getById(id);

    return await this.prismaService.product.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.getById(id);

    return this.prismaService.product.delete({
      where: {
        id,
      },
    });
  }
}
