import { BaseQueryParametersDto } from "src/shared/dto/base-query-parameters.dto";

export class FindPatientQueryDto extends BaseQueryParametersDto {
    name: string;
    email: string;
    cpf: string;
}