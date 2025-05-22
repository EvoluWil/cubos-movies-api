import { Test, TestingModule } from '@nestjs/testing';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';

describe('LanguageController', () => {
  let controller: LanguageController;
  let serviceMock: any;

  beforeEach(async () => {
    serviceMock = {
      findAll: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguageController],
      providers: [{ provide: LanguageService, useValue: serviceMock }],
    }).compile();
    controller = module.get<LanguageController>(LanguageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all languages', async () => {
    const mockLanguages = [
      { id: '1', name: 'Português' },
      { id: '2', name: 'Inglês' },
    ];
    serviceMock.findAll.mockResolvedValue(mockLanguages);
    const result = await controller.findAll();
    expect(result).toEqual(mockLanguages);
    expect(serviceMock.findAll).toHaveBeenCalled();
  });
});
