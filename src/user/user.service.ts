import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDTO } from './DTO/RegisterUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Schemas/user.schems';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
    ) {}

    async createUser(registerUserDto: RegisterUserDTO, hashed_password: string) {
        try {
            const user = await this.userModel.create({
                name: registerUserDto.name,
                age: registerUserDto.age,
                email: registerUserDto.email,
                role: registerUserDto.role,
                password: hashed_password,
            });
            return user;
        } catch (error: unknown) {
            console.log(error);

            const e = error as { code?: number };

            const DUPLICATE_KEY_CODE = 11000;

            if (e.code === DUPLICATE_KEY_CODE) {
                throw new ConflictException('Email already exists');
            }

            throw error;
        }
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({email});
    }

    async findById(id: Types.ObjectId) {
        return this.userModel.findById(id)
    }

    async updatePassword(user_id: Types.ObjectId, hashed_password: string) {
        return this.userModel.findByIdAndUpdate(
            user_id,
            {password: hashed_password},
            {new: true},
        );
    }
}
