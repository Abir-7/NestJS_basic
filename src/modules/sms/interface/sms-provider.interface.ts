export interface SendSmsPayload {
  to: string;
  message: string;
}

export interface SmsProvider {
  sendSms(payload: SendSmsPayload): Promise<any>;
}
