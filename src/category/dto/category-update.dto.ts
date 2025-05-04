import { IsOptional, IsString } from 'class-validator'

export class CategoryUpdateDto {
	@IsOptional()
	@IsString()
	title: string

	@IsString({ message: 'Потрібен опис' })
	description: string
}
