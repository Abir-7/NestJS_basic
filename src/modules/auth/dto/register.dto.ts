import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @ValidateIf((o) => !(o as RegisterDto).phone)
  @IsEmail()
  email?: string;

  @ValidateIf((o) => !(o as RegisterDto).email)
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @MinLength(6)
  confirm_password!: string;

  @IsOptional()
  @IsString()
  ip_Address?: string;

  @IsOptional()
  @IsString()
  device_fingerprint?: string;

  @IsOptional()
  @IsString()
  os_type?: string;

  @IsOptional()
  @IsString()
  device_model?: string;

  @IsOptional()
  @IsBoolean()
  is_emulator?: boolean;
}
