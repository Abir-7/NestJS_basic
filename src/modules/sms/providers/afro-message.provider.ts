/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import {
  SendSmsPayload,
  SmsProvider,
} from '../interface/sms-provider.interface';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AfroMessageProvider implements SmsProvider {
  private readonly logger = new Logger(AfroMessageProvider.name);
  private apiKey: string;
  private baseUrl = 'https://api.afromessage.com/api/send';
  private id: string;
  private sender: string; // optional: use when sender name is verified

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.apiKey = this.configService.getOrThrow('AFRO_API_KEY');
    this.id = this.configService.getOrThrow('AFRO_ID');
    this.sender = this.configService.get('AFRO_SENDER_NAME', '');
  }

  async sendSms(payload: SendSmsPayload): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.baseUrl, {
          params: {
            from: this.id,
            to: payload.to,
            message: payload.message,
          },
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }),
      );

      if (response?.data?.response?.errors) {
        this.logger.error(`${response?.data?.response?.errors}`);
      }
      return response.data;
    } catch (error: any) {
      this.logger.error(error?.message);
    }
  }
}
