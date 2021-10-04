import { BaseQueryParametersDto } from "src/shared/dto/base-query-parameters.dto";

export class FindUsersQueryDto extends BaseQueryParametersDto {
    name: string;
    email: string;
    cpf: string;
    isActive: boolean;
    role: string;
}