import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './mail.processor';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { EmailService } from './email.service';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'email',
            defaultJobOptions: {
                removeOnComplete: { age: 10 * 60 },
            },
        }),

        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: config.getOrThrow<string>('SMTP_HOST'),
                    port: Number(config.getOrThrow<string>('SMTP_PORT')),
                    // Gmail port 587
                    secure: false,
                    auth: {
                        user: config.getOrThrow<string>('SMTP_USER'),
                        pass: config.getOrThrow<string>('SMTP_PASSWORD'),
                    },
                },

                defaults: {
                    from: config.getOrThrow<string>('MAIL_FROM'),
                },

                template: {
                    dir: `${process.cwd()}/src/mail/templates`,
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    controllers: [MailController],
    providers: [MailService, EmailProcessor, EmailService],
    exports: [MailService],
})
export class MailModule {}
