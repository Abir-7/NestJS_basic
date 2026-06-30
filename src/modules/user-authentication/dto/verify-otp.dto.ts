import { IsString, IsUUID, MinLength } from 'class-validator';

export class VerifyOtpDto {
  @IsUUID()
  user_id!: string;

  @IsString()
  @MinLength(6)
  code!: string;
}
