import { EnumOrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus, {
    message: 'Статус замовлення має бути',
  })
  status: EnumOrderStatus;

  @IsArray({
    message: ' В замовленні немає жодного товару',
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsNumber({}, { message: 'Кількість має бути числом' })
  quantity: number;

  @IsNumber({}, { message: 'Ціна це число' })
  price: number;

  @IsString({ message: 'ID продукта має бути строка' })
  productId: string;

  @IsString({ message: 'ID магазина має бути строка' })
  storeId: string;
}
