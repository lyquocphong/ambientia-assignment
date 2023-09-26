import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { getDefaultService } from '@/utils/service';
import { getDefaultTimezone } from '@/utils/date';
import { AppConfig } from '@/app.type';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('config')
  getAppInfo(): AppConfig {
    const service = getDefaultService();
    const timezone = getDefaultTimezone();

    return {
      service,
      timezone,
    };
  }
}
