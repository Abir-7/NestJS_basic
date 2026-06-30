import { IsEmail, IsString, ValidateIf } from 'class-validator';

export class ForgotPasswordDto {
  @ValidateIf((o) => !(o as ForgotPasswordDto).phone)
  @IsEmail()
  email?: string;

  @ValidateIf((o) => !(o as ForgotPasswordDto).email)
  @IsString()
  phone?: string;
}
