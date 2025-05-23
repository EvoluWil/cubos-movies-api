import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

describe('WebhookController', () => {
  let controller: WebhookController;
  let serviceMock: any;

  beforeEach(async () => {
    serviceMock = { dailyTask: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [{ provide: WebhookService, useValue: serviceMock }],
    }).compile();
    controller = module.get<WebhookController>(WebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call dailyTask and return result', async () => {
    const mockResult = { ok: true };
    serviceMock.dailyTask.mockResolvedValue(mockResult);
    const result = await controller.dailyTask();
    expect(result).toEqual(mockResult);
    expect(serviceMock.dailyTask).toHaveBeenCalled();
  });
});
