/* eslint-disable @typescript-eslint/require-await */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  async process(job: Job) {
    switch (job.name) {
      case 'send-verification-email':
        console.log(job.data);
        break;

      case 'send-password-reset-email':
        console.log(job.data);
        break;
    }
  }
}
