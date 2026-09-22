import { Injectable, Inject } from '@nestjs/common';
// import { RegisterUserDTO } from '../auth/DTO/RegisterUser.dto';
import type { UserRepository } from './domain/repositories/Iuser.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.token';

@Injectable()
export class UserService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

    // async createUser(
    //     registerUserDto: RegisterUserDTO,
    //     hashed_password: string,
    //     role_id: number,
    // ) {
    //     try {
    //         return await this.userRepository.create(
    //             registerUserDto,
    //             hashed_password,
    //             role_id,
    //         );
    //     } catch (error: unknown) {
    //         console.log(error);

    //         const e = error as { code?: number };

    //         // Mongo duplicate key
    //         if (e.code === 11000) {
    //             throw new ConflictException('Email already exists');
    //         }

    //         // PostgreSQL duplicate key
    //         if (e.code === '23505') {
    //             throw new ConflictException('Email already exists');
    //         }

    //         throw error;
    //     }
    // }

    async findByEmail(email: string) {
        return this.userRepository.findByEmail(email);
    }

    // async updatePassword(
    //     id: string,
    //     hashed_password: string,
    // ) {
    //     return this.userRepository.updatePassword(
    //         id,
    //         hashed_password,
    //     );
    // }

    async getAllUser() {
        return this.userRepository.getAllUser();
    }

    async findUser(id: string) {
        return this.userRepository.findById(id);
    }
}
