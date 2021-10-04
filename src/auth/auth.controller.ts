import { Body, Controller, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/login.dto';
import { ReturnUserDto } from 'src/users/dto/return-user.dto';
import { UserRole } from 'src/users/role.enum';
import { User } from 'src/users/users.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('signup')
    async signup(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<ReturnUserDto> {
        const user = await this.authService.signUp(createUserDto)
        return {
            user,
            message: 'Cadastro realizado com sucesso',
        };
    }

    @Post('signin')
    async signin(@Body(ValidationPipe) loginDto: LoginDto) {
        return this.authService.signin(loginDto)
    }

    @Patch('email-confirmation/:token')
    async confirmEmail(@Param('token') token: string) {
        const user = await this.authService.confirmEmail(token);
        return {
            message: 'Email confirmado',
        };
    }

    @Post('send-recover-email')
    async sendRecoverPasswordEmail(
        @Body('email') email: string,
    ): Promise<{ message: string }> {
        await this.authService.sendRecoverPasswordEmail(email);
        return {
            message: 'Foi enviado um email com instruções para resetar sua senha',
        };
    }

    @Patch('reset-password/:token')
    async resetPassword(
        @Param('token') token: string,
        @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    ): Promise<{ message: string }> {
        await this.authService.resetPassword(token, changePasswordDto);

        return {
            message: 'Senha alterada com sucesso',
        };
    }

    @Patch(':id/change-password')
    @UseGuards(AuthGuard())
    async changePassword(
        @Param('id') id: string,
        @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
        @GetUser() user: User,
    ) {
        if (user.role !== UserRole.ADMIN && user.id.toString() !== id)
            throw new UnauthorizedException(
                'Você não tem permissão para realizar esta operação',
            );

        await this.authService.changePassword(id, changePasswordDto);
        return {
            message: 'Senha alterada',
        };
    }

    @Get('me')
    @UseGuards(AuthGuard())
    getMe(@GetUser() user: User): User {
        return user;
    }
}
