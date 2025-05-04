import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { createUserDto } from './dto/create-user.dto'
import { hash } from 'argon2'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async getById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: {
				stores: true,
				favorites: true,
				orders: true
			}
		})
		return user
	}

	async getByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: { email },
			include: {
				stores: true,
				favorites: true,
				orders: true
			}
		})
		return user
	}

	async toggleFavorite(productId: string, userId: string) {
		const user = await this.getById(userId)

		const isExists = user.favorites.some(
			product => product.id === productId
		)

		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				favorites: {
					[isExists ? 'disconnect' : 'connect']: {
						id: productId
					}
				}
			}
		})

		return true
	}

	async create(dto: createUserDto) {
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
				name: dto.name
			}
		})
		return user
	}
}
