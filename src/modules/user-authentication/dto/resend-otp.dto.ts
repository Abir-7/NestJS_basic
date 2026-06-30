import { IsUUID } from 'class-validator';

export class ResendOtpDto {
  @IsUUID()
  user_id!: string;
}
