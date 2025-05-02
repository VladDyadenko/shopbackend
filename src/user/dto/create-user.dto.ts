import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class createUserDto {
	@IsOptional()
	@IsString()
	name: string

	@IsString({ message: 'mail is required' })
	@IsEmail()
	email: string

	@IsString({ message: 'password is required' })
	@MinLength(6, {
		message: 'password is too short. min length is 6'
	})
	password: string
}
