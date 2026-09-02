import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule , ConfigService} from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { VideoController } from './video.controller';
import { VideoProcessor } from './video.worker';
import { VideoQueueEventsListener } from './video.queue.events';
import { MailModule } from './mail/mail.module';
import { minutes, seconds, ThrottlerGuard, ThrottlerModule, ThrottlerStorageService } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          uri: configService.get<string>('MONGO_URI'),
          autoIndex: true,
        }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: seconds(10),
          limit: 3,
        },
        {
          name: 'medium',
          ttl: seconds(40),
          limit: 7,
          blockDuration: minutes(2),
        }
      ],

      errorMessage: "Too many requests. try after some time.",
      
      storage: new ThrottlerStorageRedisService(),

    }),
    AuthModule, 
    UserModule,
    BullModule.forRoot({
      connection: {host: 'localhost' , port: 6379},
      defaultJobOptions: {
        attempts: 3, 
        removeOnComplete: 100, 
        removeOnFail: 200,
        backoff: 5000,
      },
    }),
    BullModule.registerQueue({ name: 'video'}),
    MailModule,
  ],
  controllers: [AppController, VideoController],
  providers: [
    AppService, 
    VideoProcessor, 
    VideoQueueEventsListener,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
