import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/color-update.dto';

@Injectable()
export class ColorService {
  constructor(private prismaService: PrismaService) {}

  async getByStoreId(storeId: string) {
    const colors = await this.prismaService.color.findMany({
      where: {
        storeId,
      },
    });
    return colors;
  }

  async getById(id: string) {
    const color = await this.prismaService.color.findUnique({
      where: { id },
    });

    if (!color) throw new NotFoundException('Такий колір не знайдено');

    return color;
  }

  async create(storeId: string, dto: CreateColorDto) {
    return await this.prismaService.color.create({
      data: {
        name: dto.name,
        value: dto.value,
        storeId,
      },
    });
  }

  async update(id: string, dto: UpdateColorDto) {
    await this.getById(id);

    return await this.prismaService.color.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.getById(id);

    return this.prismaService.color.delete({
      where: {
        id,
      },
    });
  }
}
