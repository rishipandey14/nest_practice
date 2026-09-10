import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { OrderCreatedItem } from 'src/ecomm/orders/events/orderCreated.event';

@Injectable()
export class MailService {
    constructor(
        @InjectQueue('email') private readonly emailQueue: Queue,
        private readonly configService: ConfigService
    ) {}

    async sendWelcomeEmail(email: string, name: string) {
        await this.emailQueue.add('Welcome', {
            email,
            name
        });
    }

    async sendResetPasswordMail(email: string, raw_token: string) {
        const url = this.configService.getOrThrow<string>('RESET_URL')
        const reset_url = `${url}/reset-password?token=${raw_token}`

        await this.emailQueue.add(
            'ResetPassword',
            {
                email,
                reset_url,
            },
        );
    }

    async sendPasswordChangeConfirmationMail(email: string) {
        await this.emailQueue.add(
            'PasswordChangedConfirmation',
            {email},
        );
    }

    async sendOrderConfirmationMail(data: {
        email: string;
        orderId: string;
        items: OrderCreatedItem[];
    }) {
        await this.emailQueue.add('OrderConfirmation', data);
    }
}
