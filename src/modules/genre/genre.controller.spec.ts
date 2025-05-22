import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';

describe('GenreController', () => {
  let controller: GenreController;
  let service: GenreService;

  beforeEach(async () => {
    service = { findAll: jest.fn() } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [{ provide: GenreService, useValue: service }],
    }).compile();

    controller = module.get<GenreController>(GenreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all genres', async () => {
    const mockGenres = [
      { id: '1', name: 'Ação' },
      { id: '2', name: 'Comédia' },
    ];
    (service.findAll as jest.Mock).mockResolvedValue(mockGenres);
    const result = await controller.findAll();
    expect(result).toEqual(mockGenres);
    expect((service.findAll as jest.Mock).mock.calls.length).toBe(1);
  });
});
