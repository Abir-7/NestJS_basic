import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { DeleteUserDto } from './dto/deleteUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Delete('delete-user')
  deleteUser(@Body() dto: DeleteUserDto) {
    return this.authService.deleteUser(dto);
  }
}
