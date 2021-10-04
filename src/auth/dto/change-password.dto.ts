import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
    @IsString({
        message: 'Informe uma senha válida',
    })
    @MinLength(6, {
        message: 'A senha deve ter no mínimo 6 caracteres',
    })
    @MaxLength(32, {
        message: 'A senha deve ter no máximo 32 caracteres.',
    })
    
    password: string;

    @IsString({
        message: 'Informe uma senha válida',
    })
    @MinLength(6, {
        message: 'A senha deve ter no mínimo 6 caracteres',
    })
    @MaxLength(32, {
        message: 'A senha deve ter no máximo 32 caracteres.',
    })
    
    passwordConfirmation: string;
}