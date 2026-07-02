/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import {
  SendSmsPayload,
  SmsProvider,
} from '../interface/sms-provider.interface';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioProvider implements SmsProvider {
  private readonly logger = new Logger(TwilioProvider.name);
  private client: Twilio;
  private from: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid =
      this.configService.getOrThrow<string>('TWILIO_ACCOUNT_SID');
    const authToken =
      this.configService.getOrThrow<string>('TWILIO_AUTH_TOKEN');
    this.from = this.configService.getOrThrow<string>('TWILIO_PHONE_NUMBER');

    this.client = new Twilio(accountSid, authToken);
  }

  async sendSms(payload: SendSmsPayload): Promise<any> {
    try {
      const message = await this.client.messages.create({
        body: payload.message,
        from: this.from,
        to: payload.to,
      });

      this.logger.log(`SMS sent to ${payload.to}: SID ${message.sid}`);
      return message;
    } catch (error: any) {
      this.logger.error(
        `Failed to send SMS to ${payload.to}: ${error?.message}`,
      );
      throw error;
    }
  }
}
