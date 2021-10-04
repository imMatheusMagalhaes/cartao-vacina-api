import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../role.enum";

export class UpdateUserDto {
    @IsOptional()
    @IsEmail({}, { message: 'Informe um endereço de email válido' })
    @MaxLength(200, { message: 'O endereço de email deve ter menos de 200 caracteres', })
    email: string;

    @IsOptional()
    @IsString({ message: 'Informe um nome de usuário válido', })
    name: string;

    @IsOptional()
    @IsString({ message: 'Informe um nome de usuário válido', })
    @MaxLength(11, { message: 'O CPF deve 11 caracteres' })
    @MinLength(11, { message: 'O CPF deve 11 caracteres' })
    cpf: string;

    @IsOptional()
    role: UserRole;

    @IsOptional()
    isActive: boolean;
}