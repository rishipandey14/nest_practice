import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDb, userDbDocument } from './schema/userModuleMapping.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserDbService {
    constructor(
        @InjectModel(UserDb.name)
        private readonly userDbModel: Model<userDbDocument>,
    ) {}

    async findMapping(userId: string, database: 'mongodb' | 'postgres') {
        return this.userDbModel.findOne({ userId, database });
    }

    async createMapping(userId: string, database: 'mongodb' | 'postgres') {
        return this.userDbModel.create({ userId, database });
    }
}
