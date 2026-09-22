import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDb, UserDbSchema } from './schema/userModuleMapping.schema';
import { UserDbService } from './userDbMapping.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: UserDb.name,
                schema: UserDbSchema,
            },
        ]),
    ],
    providers: [UserDbService],
    exports: [UserDbService],
})
export class UserDbModule {}
