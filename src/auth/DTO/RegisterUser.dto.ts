import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class RegisterUserDTO {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    age!: number;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;
}
