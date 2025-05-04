import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { Auth } from '@auth/decorators/auth.decorator'
import { CategoryDto } from './dto/category.dto'
import { CategoryUpdateDto } from './dto/category-update.dto'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Auth()
	@Get('by-storeId/:storeId')
	async getByStoreId(@Param('id') storeId: string) {
		return await this.categoryService.getByStoreId(storeId)
	}

	@Auth()
	@Get('by-id/:id')
	async getById(@Param('id') id: string) {
		return await this.categoryService.getById(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post(':storeId')
	async create(@Body() dto: CategoryDto, @Param('storeId') storeId: string) {
		return await this.categoryService.create(storeId, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: CategoryUpdateDto) {
		return await this.categoryService.update(id, dto)
	}

	@HttpCode(200)
	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return await this.categoryService.delete(id)
	}
}
