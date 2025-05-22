import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { GenreService } from './genre.service';

describe('GenreService', () => {
  let service: GenreService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      genre: {
        findMany: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenreService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get<GenreService>(GenreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all genres', async () => {
    const mockGenres = [
      { id: '1', name: 'Ação' },
      { id: '2', name: 'Comédia' },
    ];
    prisma.genre.findMany.mockResolvedValue(mockGenres);
    const result = await service.findAll();
    expect(result).toEqual(mockGenres);
    expect(prisma.genre.findMany).toHaveBeenCalled();
  });
});
