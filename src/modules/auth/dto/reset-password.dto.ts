import { IsString, IsUUID, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsUUID()
  user_id!: string;

  @IsUUID()
  token!: string;

  @IsString()
  @MinLength(6)
  new_password!: string;
}
