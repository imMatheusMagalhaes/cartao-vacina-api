import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
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
    @MaxLength(200, { message: 'O nome deve ter menos de 200 caracteres' })
    address: string

    @IsOptional()
    @MaxLength(12, { message: 'O nome deve ter menos de 12 caracteres' })
    phone: string

    @IsOptional()
    @MaxLength(10, { message: 'O nome deve ter menos de 10 caracteres' })
    age: string
}
