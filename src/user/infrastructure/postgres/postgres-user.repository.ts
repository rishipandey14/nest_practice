import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/domain/repositories/Iuser.repository';
import { UserEntity } from './entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/domain/entity/user.entity';

@Injectable()
export class PostgresUserRepository implements UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly dataSource: DataSource,
    ) {}

    async findById(id: string): Promise<User | null> {
        const postgresUser = await this.userRepository.findOne({
            where: {
                id: Number(id),
            },
        });

        if (!postgresUser) return null;

        return new User(
            postgresUser.id.toString(),
            postgresUser.name,
            postgresUser.age,
            postgresUser.email,
            postgresUser.role_id,
            postgresUser.password,
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const postgresUser = await this.userRepository.findOne({
            where: { email },
        });

        if (!postgresUser) return null;

        return new User(
            postgresUser.id.toString(),
            postgresUser.name,
            postgresUser.age,
            postgresUser.email,
            postgresUser.role_id,
            postgresUser.password,
        );
    }

    async getAllUser(): Promise<User[]> {
        const result = await this.dataSource.query(
            `
            SELECT * FROM fn_get_all_users()
            `,
        );
        return result;
    }
}
