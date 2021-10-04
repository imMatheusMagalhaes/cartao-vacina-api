import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'Informe um endereço de email' })
    @MaxLength(11, { message: 'O CPF deve 11 caracteres' })
    @MinLength(11, { message: 'O CPF deve 11 caracteres' })
    cpf: string;

    @IsNotEmpty({ message: 'Informe uma senha' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password: string;
}