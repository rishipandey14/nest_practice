import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { EmailService } from "./email.service";

interface WelcomeEmailJob {
    name: string,
    email: string
}

interface ResetPasswordEmailJob {
    email: string,
    reset_url: string
}

interface PasswordChangeConfirmationEmailJob {
    email: string
}


@Processor('email', {concurrency: 2})
export class EmailProcessor extends WorkerHost {
    constructor(private readonly emailService: EmailService) {
        super();
    }

    async process(job: Job) {
        console.log(`Processing email job: ${job.name}`);

        switch(job.name){
            case 'Welcome': {
                const data = job.data as WelcomeEmailJob;

                await this.emailService.sendWelcomeEmail(
                    data.email,
                    data.name
                )
                console.log(`Welcome Email sent to: ${job.data.email}`)
                break;
            }
            case 'ResetPassword': {
                const data = job.data as ResetPasswordEmailJob;

                await this.emailService.sendResetPasswordEmail(
                    data.email,
                    data.reset_url
                )
                console.log(`Password reset Email sent to: ${data.email}`)
                break;
            }

            case 'PasswordChangedConfirmation': {
                const data = job.data as PasswordChangeConfirmationEmailJob;

                await this.emailService.sendPasswordChangedConfirmationEmail(
                    data.email,
                )
                console.log(`Password changed confirmation email sent to: ${data.email}`)
                break;
            }

            default:
                throw new Error(`Unknown Email job: ${job.name}`)
        }
    }
};