import { Global, Module } from '@nestjs/common';
import { AfroMessageProvider } from './providers/afro-message.provider';
import { TwilioProvider } from './providers/twilio.provider';
import { SmsService } from './sms.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [SmsService, AfroMessageProvider, TwilioProvider],
  exports: [SmsService], // ← other modules inject this
})
export class SmsModule {}
