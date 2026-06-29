import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUES } from './constants/queue-names';
import { EmailProcessor } from './processors/email.processor';
import { EmailProducer } from './producers/email.producer';
import { MailModule } from '../mail/mail.module';
import { SmsModule } from '../sms/sms.module';
import { SmsProcessor } from './processors/sms.processor';
import { SmsProducer } from './producers/sms.producer';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: QUEUES.EMAIL,
      },
      {
        name: QUEUES.SMS,
      },
    ),
    MailModule,
    SmsModule,
  ],
  providers: [
    EmailProcessor,
    EmailProducer,
    SmsProcessor, // ← new
    SmsProducer,
  ],
  exports: [EmailProducer, SmsProducer],
})
export class JobsModule {}
