import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @IsString({ message: 'Відгук це текст' })
  @IsNotEmpty({ message: 'Текс має бути' })
  text: string;

  @IsNumber({}, { message: 'Рейтинг це числове значення' })
  @Min(1, { message: 'Мінімальний рейтинг дорівнює 1' })
  @Max(5, { message: 'Максимальний рейтинг дорівнює 5' })
  @IsNotEmpty({ message: 'Рейтинг має бути вказаний' })
  rating: number;
}
