import { IsNotEmpty, MaxLength } from "class-validator"


export class CreateVaccineDto {
    @IsNotEmpty({ message: 'Informe a data' })
    @MaxLength(10, { message: 'O nome deve ter menos de 10 caracteres' })
    date: string

    @IsNotEmpty({ message: 'Informe o lote' })
    @MaxLength(200, { message: 'O endereço de email deve ter menos de 200 caracteres', })
    lote: string

    @IsNotEmpty({ message: 'Informe o laboratório' })
    @MaxLength(200, { message: 'O endereço de email deve ter menos de 200 caracteres', })
    lab: string

    @IsNotEmpty({ message: 'Informe a unidade' })
    @MaxLength(200, { message: 'O endereço de email deve ter menos de 200 caracteres', })
    us: string
}