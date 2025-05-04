import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateProductDto {
	@IsString({ message: 'Потрібна назва' })
	@IsNotEmpty({ message: 'Назва не може бути пуста' })
	title: string

	@IsString({ message: 'Опис має бути' })
	@IsNotEmpty({ message: 'Опис не може бути пустий' })
	description: string

	@IsNumber({}, { message: 'Ціна це число' })
	@IsNotEmpty({ message: 'Ціна не може бути пустою' })
	price: number

	@IsString({ message: 'Додайте хоча-б одну картинку', each: true })
	@ArrayMinSize(1, { message: 'Має бути хоча-б одна картинка' })
	@IsNotEmpty({ message: 'Шлях до картинки не може бути пустим', each: true })
	images: string[]

	@IsString({ message: 'Категорія має бути' })
	@IsNotEmpty({ message: 'ID категорії має бути' })
	categoryId: string

	@IsString({ message: 'Колір має бути' })
	@IsNotEmpty({ message: 'ID кольора має бути' })
	colorId: string
}
