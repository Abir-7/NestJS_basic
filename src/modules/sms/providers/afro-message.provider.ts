import { Injectable } from '@nestjs/common';
import {
  SendSmsPayload,
  SmsProvider,
} from '../interface/sms-provider.interface';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AfroMessageProvider implements SmsProvider {
  private apiKey: string;
  private sender: string;
  private baseUrl = 'https://api.afromessage.com/api/send';
  private id: string;
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.apiKey = this.configService.getOrThrow('AFRO_API_KEY');
    this.sender = this.configService.getOrThrow('AFRO_SENDER_NAME');
    this.id = this.configService.getOrThrow('AFRO_ID');
  }
  async sendSms(payload: SendSmsPayload): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(this.baseUrl, {
        params: {
          from: this.sender,
          to: payload.to,
          message: payload.message,
        },
        headers: { Authorization: `Bearer ${this.apiKey}` },
      }),
    );
    return response.data;
  }
}
