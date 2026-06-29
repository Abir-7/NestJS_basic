import { Queue } from 'bullmq';
import { QUEUES } from '../constants/queue-names';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsProducer {
  constructor(
    @InjectQueue(QUEUES.SMS)
    private readonly queue: Queue,
  ) {}
  async sendOtp(phone: string, otp: string) {
    await this.queue.add('send-otp', { phone, otp });
  }
}
