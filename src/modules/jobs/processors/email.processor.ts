/* eslint-disable @typescript-eslint/require-await */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from '../../mail/mail.service';
interface VerificationEmailJob {
  email: string;
  otp: string;
}

@Processor('email')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }
  async process(job: Job<VerificationEmailJob>) {
    switch (job.name) {
      case 'send-verification-email': {
        const { email, otp } = job.data;
        await this.mailService.sendMail(
          email,
          'Verify your account',
          `<h1>Your OTP is ${otp}</h1>`,
        );
        break;
      }

      case 'send-password-reset-email': {
        const { email, otp } = job.data;
        await this.mailService.sendMail(
          email,
          'Reset Password',
          `<h1>Your OTP is ${otp}</h1>`,
        );
        break;
      }
    }
  }
}
