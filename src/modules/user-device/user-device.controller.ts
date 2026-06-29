import { Controller } from '@nestjs/common';
import { UserDeviceService } from './user-device.service';

@Controller('user-device')
export class UserDeviceController {
  constructor(private readonly userDeviceService: UserDeviceService) {}
}
