import { IsString } from 'class-validator'

export class CreateStoreDto {
	@IsString({ message: 'Назва обовязкова' })
	title: string
}
