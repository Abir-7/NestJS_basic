import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUES } from './constants/queue-names';
import { EmailProcessor } from './processors/email.processor';
import { EmailProducer } from './producers/email.producer';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.EMAIL,
    }),
    MailModule,
  ],
  providers: [EmailProcessor, EmailProducer],
  exports: [EmailProducer],
})
export class JobsModule {}
