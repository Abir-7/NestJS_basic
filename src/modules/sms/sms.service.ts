import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import {
  SendSmsPayload,
  SmsProvider,
} from './interface/sms-provider.interface';
import { ConfigService } from '@nestjs/config';
import { AfroMessageProvider } from './providers/afro-message.provider';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private provider: SmsProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly afroMessageProvider: AfroMessageProvider,
  ) {
    const active = this.configService.getOrThrow<string>('SMS_PROVIDER');

    switch (active) {
      case 'afro':
        this.provider = this.afroMessageProvider;
        break;

      case 'twilio':
        throw new Error('Twilio provider not implemented yet');

      default:
        throw new BadRequestException(
          `Invalid SMS_PROVIDER: ${active}. Use "afro"`,
        );
    }

    if (!this.provider) {
      throw new Error('SMS provider initialization failed');
    }
    this.logger.log(`SMS provider active: ${active}`);
  }

  async sendSms(payload: SendSmsPayload): Promise<any> {
    return this.provider.sendSms(payload);
  }
}
