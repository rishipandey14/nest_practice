import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to My App',
      template: 'welcome.hbs',
      context: {
        name,
      },
    });
  }

  async sendResetPasswordEmail(email: string, reset_url: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset mail',
      template: 'resetPassword.hbs',
      context: {
        reset_url,
      },
    });
  }

  async sendPasswordChangedConfirmationEmail(email: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Password Changed',
      template: 'changedPassword.hbs',
      context: {
        email,
      },
    });
  }
}
