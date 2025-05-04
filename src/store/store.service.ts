import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'

@Injectable()
export class StoreService {
	constructor(private prismaService: PrismaService) {}

	async getById(storeId: string, userId: string) {
		const store = await this.prismaService.store.findUnique({
			where: {
				id: storeId,
				userId
			}
		})

		if (!store)
			throw new NotFoundException(
				'Магазин не знайдений або Ви не його власник'
			)

		return store
	}

	async create(userId: string, dto: CreateStoreDto) {
		return await this.prismaService.store.create({
			data: {
				title: dto.title,
				userId
			}
		})
	}

	async update(storeId: string, userId: string, dto: UpdateStoreDto) {
		await this.getById(storeId, userId)

		return await this.prismaService.store.update({
			where: {
				id: storeId
			},
			data: {
				...dto,
				userId
			}
		})
	}

	async delete(storeId: string, userId: string) {
		await this.getById(storeId, userId)

		return this.prismaService.store.delete({
			where: {
				id: storeId
			}
		})
	}
}
