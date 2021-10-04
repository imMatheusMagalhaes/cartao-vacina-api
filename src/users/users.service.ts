import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './role.enum';
import { User } from './users.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) { }

    async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
        if (createUserDto.password != createUserDto.passwordConfirmation) {
            throw new UnprocessableEntityException('As senhas não conferem');
        } else {
            return this.userRepository.createUser(createUserDto, UserRole.ADMIN);
        }
    }

    async findUserById(userId: string) {
        const user = await this.userRepository.findOne(userId, {
            select: ['cpf', 'email', 'name', 'role', 'id']
        })

        if (!user)
            throw new NotFoundException('Usuário não encontrado')

        return user
    }

    async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
        const user = await this.findUserById(id)

        const { name, email, role, cpf, isActive } = updateUserDto;

        user.email = email ? email : user.email;
        user.name = name ? name : user.name;
        user.cpf = cpf ? cpf : user.cpf;
        user.role = role ? role : user.role;
        user.isActive = isActive === undefined ? user.isActive : isActive;

        try {
            await this.userRepository.save(user)
            return user
        } catch (error) {
            throw new InternalServerErrorException(
                'Erro ao salvar os dados no banco de dados',
            );
        }

    }

    async deleteUser(userId: string) {
        const result = await this.userRepository.delete({ id: Number(userId) })

        if (result.affected === 0) {
            throw new NotFoundException(
                'Não foi encontrado um usuário com o ID informado',
            );
        }
    }

    async findUsers(
        queryDto: FindUsersQueryDto,
    ): Promise<{ users: User[]; total: number }> {
        const users = await this.userRepository.findUsers(queryDto);
        return users;
    }
}
