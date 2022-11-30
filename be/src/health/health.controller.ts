import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../auth/sso.strategy';

@Controller('health')
export class HealthController {
  @Throttle(3, 30)
  @Public()
  @Get()
  health() {
    return 'ok';
  }
}
