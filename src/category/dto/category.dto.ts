import { IsString } from 'class-validator'

export class CategoryDto {
	@IsString({ message: 'Потрібна назва' })
	title: string

	@IsString({ message: 'Потрібен опис' })
	description: string
}
