import { Module, Scope } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/postgres/entity/user.entity';
import { MongoUser, MongoUserSchema } from './infrastructure/mongoDB/Schemas/user.schems';
import { MongoUserRepository } from './infrastructure/mongoDB/mongo-user.repository';
import { PostgresUserRepository } from './infrastructure/postgres/postgres-user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.token';
import { REQUEST } from '@nestjs/core';
import { UserRepository } from './domain/repositories/Iuser.repository';
import { DatabaseRequest } from 'src/shared/database-access/database-request';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: MongoUser.name, 
        schema: MongoUserSchema
      }
    ]),
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
  ],
  providers: [
    MongoUserRepository,
    PostgresUserRepository,
    {
      provide: USER_REPOSITORY,
      scope: Scope.REQUEST,

      inject: [
        REQUEST,
        MongoUserRepository,
        PostgresUserRepository
      ],
      useFactory: (
        req: DatabaseRequest,
        mongoRepository: MongoUserRepository,
        postgresRepository: PostgresUserRepository,
      ) : UserRepository => {
        const database = req.dbContext?.database

        if(!database) throw new Error("Database context has not been initialized");

        if(database === 'mongodb') return mongoRepository;
        return postgresRepository;
      }
    },
    UserService
  ],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
