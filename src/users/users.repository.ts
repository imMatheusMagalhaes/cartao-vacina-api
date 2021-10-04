import { EntityRepository, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./users.entity";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { UserRole } from "./role.enum";
import { LoginDto } from "./dto/login.dto";
import { FindUsersQueryDto } from "./dto/find-users-query.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async findUsers(queryDto: FindUsersQueryDto): Promise<{ users: User[], total: number }> {
        queryDto.isActive = queryDto.isActive === undefined ? true : queryDto.isActive
        queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
        queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

        const { cpf, email, name, role, isActive } = queryDto
        const query = this.createQueryBuilder('user');

        query.where('user.isActive = :isActive', { isActive });

        if (email)
            query.andWhere('user.email ILIKE :email', { email: `%${email}%` });

        if (cpf)
            query.andWhere('user.cpf ILIKE :cpf', { cpf: `%${cpf}%` })

        if (name)
            query.andWhere('user.name ILIKE :name', { name: `%${name}%` });

        if (role)
            query.andWhere('user.role = :role', { role });

        query.skip((queryDto.page - 1) * queryDto.limit);
        query.take(+queryDto.limit);
        query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
        query.select(['user.name', 'user.email', 'user.cpf', 'user.role', 'user.isActive']);

        const [users, total] = await query.getManyAndCount();

        return { users, total };
    }

    async createUser(createUserDto: CreateUserDto, role: UserRole): Promise<User> {
        const { cpf, email, name, password } = createUserDto;
        const user = this.create();
        user.cpf = cpf;
        user.email = email;
        user.name = name;
        user.role = role;
        user.salt = await bcrypt.genSalt();
        user.confirmationToken = crypto.randomBytes(32).toString('hex');
        user.password = await this.hashPassword(password, user.salt);

        try {
            await this.save(user)
            delete user.password
            delete user.salt
            return user;
        } catch (error) {
            if (error.code.toString() === '23505') {
                throw new ConflictException('CPF e/ou E-mail já cadastrados');
            } else {
                throw new InternalServerErrorException(
                    'Erro ao salvar o usuário no banco de dados',
                );
            }
        }
    }

    async changePassword(id: string, password: string) {
        const user = await this.findOne(id);
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        user.recoverToken = null;
        await this.save(user);
    }

    async checkCredentials(loginDto: LoginDto): Promise<User> {
        const { cpf, password } = loginDto;
        const user = await this.findOne({ cpf, isActive: true });

        if (user && (await user.checkPassword(password))) {
            return user;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}