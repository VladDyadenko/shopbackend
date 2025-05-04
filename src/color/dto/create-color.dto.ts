import { IsString } from 'class-validator'

export class CreateColorDto {
	@IsString({ message: 'Потрібна назва' })
	name: string

	@IsString({ message: 'Потрібно значення' })
	value: string
}
