import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

describe('MovieController', () => {
  let controller: MovieController;
  let serviceMock: any;

  beforeEach(async () => {
    serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [{ provide: MovieService, useValue: serviceMock }],
    }).compile();
    controller = module.get<MovieController>(MovieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a movie', async () => {
    const dto = { title: 'Test Movie' };
    const user = { id: 1 };
    const mockMovie = { id: 1, title: 'Test Movie' };
    serviceMock.create.mockResolvedValue(mockMovie);
    const result = await controller.create(dto as any, user as any);
    expect(result).toEqual(mockMovie);
    expect(serviceMock.create).toHaveBeenCalledWith(dto, user.id);
  });

  it('should return all movies', async () => {
    const mockMovies = [
      { id: 1, title: 'Test Movie' },
      { id: 2, title: 'Another Movie' },
    ];
    serviceMock.findAll.mockResolvedValue(mockMovies);
    const result = await controller.findAll();
    expect(result).toEqual(mockMovies);
    expect(serviceMock.findAll).toHaveBeenCalled();
  });

  it('should return a movie by id', async () => {
    const mockMovie = { id: 1, title: 'Test Movie' };
    serviceMock.findOne.mockResolvedValue(mockMovie);
    const result = await controller.findOne('1');
    expect(result).toEqual(mockMovie);
    expect(serviceMock.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a movie', async () => {
    const dto = { title: 'Updated Movie' };
    const user = { id: 1 };
    const mockMovie = { id: 1, title: 'Updated Movie' };
    serviceMock.update.mockResolvedValue(mockMovie);
    const result = await controller.update('1', dto as any, user as any);
    expect(result).toEqual(mockMovie);
    expect(serviceMock.update).toHaveBeenCalledWith('1', dto, user.id);
  });

  it('should delete a movie', async () => {
    const user = { id: 1 };
    const mockMovie = { id: 1, title: 'Test Movie' };
    serviceMock.remove.mockResolvedValue(mockMovie);
    const result = await controller.remove('1', user as any);
    expect(result).toEqual(mockMovie);
    expect(serviceMock.remove).toHaveBeenCalledWith('1', user.id);
  });
});
