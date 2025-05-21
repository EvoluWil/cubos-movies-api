import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPublic()
  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
