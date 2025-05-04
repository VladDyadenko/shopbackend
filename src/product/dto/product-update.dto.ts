import {
	ArrayMinSize,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator'

export class UpdateProductDto {
	@IsOptional()
	@IsString({ message: 'Потрібна назва' })
	@IsNotEmpty({ message: 'Назва не може бути пуста' })
	title: string

	@IsOptional()
	@IsString({ message: 'Опис має бути' })
	@IsNotEmpty({ message: 'Опис не може бути пустий' })
	description: string

	@IsOptional()
	@IsNumber({}, { message: 'Ціна це число' })
	@IsNotEmpty({ message: 'Ціна не може бути пустою' })
	price: number

	@IsOptional()
	@IsString({ message: 'Додайте хоча-б одну картинку', each: true })
	@ArrayMinSize(1, { message: 'Має бути хоча-б одна картинка' })
	@IsNotEmpty({ message: 'Шлях до картинки не може бути пустим', each: true })
	images: string[]

	@IsOptional()
	@IsString({ message: 'Категорія має бути' })
	@IsNotEmpty({ message: 'ID категорії має бути' })
	categoryId: string

	@IsOptional()
	@IsString({ message: 'Колір має бути' })
	@IsNotEmpty({ message: 'ID кольора має бути' })
	colorId: string
}
