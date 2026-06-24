import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUES } from '../constants/queue-names';

@Injectable()
export class EmailProducer {
  constructor(
    @InjectQueue(QUEUES.EMAIL)
    private readonly queue: Queue,
  ) {}

  async sendVerificationEmail(email: string, otp: string) {
    await this.queue.add('send-verification-email', {
      email,
      otp,
    });
  }
}
