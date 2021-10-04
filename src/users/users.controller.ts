import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { RolesGuard } from '../auth/roles.guard';
import { UsersService } from './users.service';
import { Role } from 'src/auth/role.decorator';
import { UserRole } from './role.enum';
import { UserRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from './users.entity';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('admin')
  @Role(UserRole.ADMIN)
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Administrador cadastrado com sucesso',
    };
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async findUserById(@Param('id') id): Promise<ReturnUserDto> {
    const user = await this.usersService.findUserById(id)

    return {
      user,
      message: 'Usuário encontrado'

    }
  }

  @Patch(':id')
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Param('id') id: string,
    @GetUser() user: User) {
    if (user.role != UserRole.ADMIN && user.id != Number(id))
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      );

    return this.usersService.updateUser(updateUserDto, id)
  }

  @Delete(':id')
  async deleteuser(@Param('id') id: string) {
    await this.usersService.deleteUser(id)
    return {
      message: 'Usuário removido com sucesso'
    }

  }

  @Get()
  @Role(UserRole.ADMIN)
  async findUsers(@Query() query: FindUsersQueryDto) {
    /*
      SINTAXE DE CONSULTA
      "?name=NAME_USER&cpf=CPF_USER&isActive={true || false}*role=ROLE_USER"
      Deve ser feita atravez da URL
    */
    const found = await this.usersService.findUsers(query);
    return {
      found,
      message: 'Usuários encontrados',
    };

  }
}
