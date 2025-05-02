import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { createUserDto } from '@user/dto/create-user.dto'
import { UserService } from '@user/user.service'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private prisma: PrismaService
	) {}

	async login(dto: createUserDto) {
		const user = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async register(dto: createUserDto) {
		const oldUser = await this.userService.getByEmail(dto.email)

		if (oldUser) throw new BadRequestException('Користувач вже існує')

		const user = await this.userService.create(dto)
		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, { expiresIn: '1h' })

		const refreshToken = this.jwt.sign(data, { expiresIn: '7d' })

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: createUserDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) {
			throw new NotFoundException('Користувач не знайдений')
		}

		return user
	}
}
