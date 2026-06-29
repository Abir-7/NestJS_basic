/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Logger } from '@nestjs/common';
import { SmsService } from '../../sms/sms.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

interface OtpSmsJob {
  phone: string;
  otp: string;
}
@Processor('sms')
export class SmsProcessor extends WorkerHost {
  private readonly logger = new Logger(SmsProcessor.name);

  constructor(private readonly smsService: SmsService) {
    super();
  }
  async process(job: Job<OtpSmsJob>) {
    switch (job.name) {
      case 'send-otp': {
        const { phone, otp } = job.data;

        await this.smsService.sendSms({
          to: phone,
          message: `Your OTP is: ${otp}`,
        });

        break;
      }
      case 'send-resend': {
        const { phone, otp } = job.data;
        await this.smsService.sendSms({
          to: phone,
          message: `Your OTP is: ${otp}`,
        });

        break;
      }
    }
  }
}
