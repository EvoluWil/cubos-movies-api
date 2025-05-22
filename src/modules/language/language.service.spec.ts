import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      language: {
        findMany: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguageService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<LanguageService>(LanguageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all languages', async () => {
    const mockLanguages = [
      { id: '1', name: 'Português' },
      { id: '2', name: 'Inglês' },
    ];
    prisma.language.findMany.mockResolvedValue(mockLanguages);
    const result = await service.findAll();
    expect(result).toEqual(mockLanguages);
    expect(prisma.language.findMany).toHaveBeenCalled();
  });
});
