import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CategoryDto } from './dto/category.dto'
import { CategoryUpdateDto } from './dto/category-update.dto'

@Injectable()
export class CategoryService {
	constructor(private prismaService: PrismaService) {}

	async getByStoreId(storeId: string) {
		const colors = await this.prismaService.category.findMany({
			where: {
				id: storeId
			}
		})
		return colors
	}

	async getById(id: string) {
		const color = await this.prismaService.category.findUnique({
			where: { id }
		})

		if (!color) throw new NotFoundException('Категорія не знайдена')

		return color
	}

	async create(storeId: string, dto: CategoryDto) {
		return await this.prismaService.category.create({
			data: {
				title: dto.title,
				description: dto.description,
				storeId
			}
		})
	}

	async update(id: string, dto: CategoryUpdateDto) {
		await this.getById(id)

		return await this.prismaService.category.update({
			where: {
				id
			},
			data: dto
		})
	}

	async delete(id: string) {
		await this.getById(id)

		return this.prismaService.category.delete({
			where: {
				id
			}
		})
	}
}
