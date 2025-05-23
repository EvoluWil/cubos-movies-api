import { Controller, Get } from '@nestjs/common';
import { IsPublic } from 'src/decorators/public.decorator';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @IsPublic()
  @Get('daily-task')
  dailyTask() {
    return this.webhookService.dailyTask();
  }
}
