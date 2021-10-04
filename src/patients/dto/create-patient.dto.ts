import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreatePatientDto {
    @IsNotEmpty({ message: 'Informe um endereço de email' })
    @IsEmail({}, { message: 'Informe um endereço de email válido' })
    @MaxLength(200, { message: 'O endereço de email deve ter menos de 200 caracteres', })
    email: string;

    @IsNotEmpty({ message: 'Informe o nome do paciente' })
    @MaxLength(200, { message: 'O nome deve ter menos de 200 caracteres' })
    name: string

    @IsNotEmpty({ message: 'Informe o CPF' })
    @MaxLength(11, { message: 'O CPF deve 11 caracteres' })
    @MinLength(11, { message: 'O CPF deve 11 caracteres' })
    cpf: string

    @IsNotEmpty({ message: 'Informe o endereço' })
    @MaxLength(200, { message: 'O nome deve ter menos de 200 caracteres' })
    address: string

    @IsNotEmpty({ message: 'Informe o telefone' })
    @MaxLength(12, { message: 'O nome deve ter menos de 12 caracteres' })
    phone: string

    @IsNotEmpty({ message: 'Informe a data de nascimento' })
    @MaxLength(10, { message: 'O nome deve ter menos de 10 caracteres' })
    age: string
}
