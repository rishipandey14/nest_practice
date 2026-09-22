import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/domain/entity/user.entity';
import { UserRepository } from 'src/user/domain/repositories/Iuser.repository';
import { MongoUser } from 'src/user/infrastructure/mongoDB/Schemas/user.schems';

@Injectable()
export class MongoUserRepository implements UserRepository {
    constructor(@InjectModel(MongoUser.name) private readonly userModel: Model<MongoUser>) {}

    async findById(id: string): Promise<User | null> {
        const mongoUser = await this.userModel.findById(id).lean().exec();

        if (!mongoUser) return null;

        return new User(
            mongoUser._id.toString(),
            mongoUser.name,
            mongoUser.age,
            mongoUser.email,
            mongoUser.role_id,
            mongoUser.password,
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const mongoUser = await this.userModel.findOne({ email }).lean().exec();

        if (!mongoUser) return null;

        return new User(
            mongoUser._id.toString(),
            mongoUser.name,
            mongoUser.age,
            mongoUser.email,
            mongoUser.role_id,
            mongoUser.password,
        );
    }

    async getAllUser(): Promise<User[]> {
        const mongoUsers = await this.userModel.find().exec();

        return mongoUsers.map(
            (mongoUser) =>
                new User(
                    mongoUser._id.toString(),
                    mongoUser.name,
                    mongoUser.age,
                    mongoUser.email,
                    mongoUser.role_id,
                    mongoUser.password,
                ),
        );
    }
}
