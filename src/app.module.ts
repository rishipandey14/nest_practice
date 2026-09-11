import { ExecutionContext, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { VideoController } from './video.controller';
import { VideoProcessor } from './video.worker';
import { VideoQueueEventsListener } from './video.queue.events';
import { MailModule } from './mail/mail.module';
import {
  minutes,
  seconds,
  ThrottlerGuard,
  ThrottlerModule,
} from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { PermissionModule } from './permission/permission.module';
import { RolesModule } from './roles/roles.module';
import { ProductsModule } from './ecomm/products/products.module';
import KeyvRedis from '@keyv/redis';
import {TypeOrmModule} from '@nestjs/typeorm'
import { CategoryModule } from './ecomm/category/category.module';
import { InventoryModule } from './ecomm/inventory/inventory.module';
import { EventEmitterModule} from '@nestjs/event-emitter'
import { OrdersModule } from './ecomm/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        autoIndex: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        // synchronize: true, // Don't use true in production
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: seconds(30),
          limit: 3,
        },
        {
          name: 'medium',
          ttl: seconds(60),
          limit: 7,
          blockDuration: minutes(2),
        },
      ],

      errorMessage: 'Too many requests. try after some time.',

      storage: new ThrottlerStorageRedisService(),

      // tracking based on company-id like in a SaaS product
      getTracker: (req: Record<string, any>, context: ExecutionContext) => {
        // console.log(req.headers['company-id']);
        return req.headers['company-id'];
      },

      // generates a uniques rate-limiting key based on the tracker , if using default tracker i.e., ip address then
      // it will generate the key as the hash of ip address and endpoint
      generateKey: (
        context: ExecutionContext,
        trackerString: string,
        throttlerName: string,
      ) => {
        // by default it will return the tracker string as the key and that will block all the endpoints related to that
        // tracker string value i.e., company-id

        // return trackerString;

        // now, this custom key will only block a particular endpoint per company
        const request = context.switchToHttp().getRequest();
        return `${trackerString}:${request.method}:${request.route?.path}`;
      },
    }),
    BullModule.forRoot({
      connection: { host: 'localhost', port: 6379 },
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 5,
        removeOnFail: 20,
        backoff: 5000,
      },
    }),
    BullModule.registerQueue({ name: 'video' }),
    // make cache available through out the application
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ttl: 60 * 1000,
          stores: new KeyvRedis(configService.get<string>('REDIS_URL'))
        }
      }
    }),
    MailModule,
    AuthModule,
    UserModule,
    PermissionModule,
    RolesModule,
    ProductsModule,
    CategoryModule,
    InventoryModule,
    OrdersModule
  ],
  controllers: [AppController, VideoController],
  providers: [
    AppService,
    VideoProcessor,
    VideoQueueEventsListener,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
