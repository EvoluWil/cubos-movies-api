import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { QueryBuilderService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UploadService } from 'src/providers/upload/upload.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieService } from './movie.service';

jest.mock('src/utils/get-you-tube-url.util', () => ({
  getYouTubeUrl: jest.fn().mockImplementation((id) => `https://youtu.be/${id}`),
}));

describe('MovieService', () => {
  let service: MovieService;
  let uploadMock: any;
  let qbMock: any;
  let prismaMock: any;

  beforeEach(async () => {
    uploadMock = {
      uploadBase64Image: jest.fn().mockResolvedValue('mocked-cover-url'),
    };
    qbMock = {
      query: jest.fn().mockResolvedValue({}),
    };
    prismaMock = {
      movie: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: QueryBuilderService, useValue: qbMock },
        { provide: UploadService, useValue: uploadMock },
      ],
    }).compile();
    service = module.get<MovieService>(MovieService);
  });

  it('should create a movie', async () => {
    const dto = {
      title: 'Test',
      originalTitle: 'Test',
      description: 'desc',
      synopsis: 'syn',
      releaseAt: new Date().toISOString(),
      genreIds: ['1'],
      languageId: '2',
      coverBase64: 'base64',
      videoYouTubeId: 'abc123',
      popularity: 0,
      votes: 0,
      quality: 0,
      budget: 0,
      revenue: 0,
      duration: 120,
    };
    await service.create(dto as any, 'user1');
    expect(uploadMock.uploadBase64Image).toHaveBeenCalledWith('base64');
    expect(prismaMock.movie.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Test',
          coverUrl: 'mocked-cover-url',
          videoUrl: 'https://youtu.be/abc123',
          genres: { connect: [{ id: '1' }] },
          language: { connect: { id: '2' } },
          createdBy: { connect: { id: 'user1' } },
        }),
      }),
    );
  });

  it('should return all movies with query builder', async () => {
    const mockMovies = [
      { id: '1', title: 'Test', quality: 'HD', coverUrl: 'url', genres: [] },
    ];
    prismaMock.movie.findMany = jest.fn().mockResolvedValue(mockMovies);
    const result = await service.findAll();
    expect(result).toEqual(mockMovies);
    expect(qbMock.query).toHaveBeenCalledWith('movie');
    expect(prismaMock.movie.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          id: true,
          title: true,
          quality: true,
          coverUrl: true,
          genres: true,
        }),
      }),
    );
  });

  it('should find one movie with details', async () => {
    prismaMock.movie.findFirst = jest
      .fn()
      .mockResolvedValueOnce({ id: '1' })
      .mockResolvedValueOnce({ id: '1', genres: [], language: {} });
    const result = await service.findOne('1');
    expect(result).toEqual({ id: '1', genres: [], language: {} });
  });

  it('should throw if movie not found (findOne)', async () => {
    prismaMock.movie.findFirst = jest.fn().mockResolvedValue(null);
    await expect(service.findOne('404')).rejects.toThrow(NotFoundException);
  });

  it('should update a movie if user is creator', async () => {
    const dto: UpdateMovieDto = {
      title: 'Updated',
      genreIds: ['1'],
      languageId: '2',
    };
    prismaMock.movie.findFirst = jest.fn().mockResolvedValue({
      createdById: 'user1',
      videoUrl: 'old',
      coverUrl: 'old',
      genres: [],
    });
    prismaMock.movie.update = jest.fn().mockResolvedValue({ ...dto });
    const result = await service.update('1', dto, 'user1');
    expect(result).toEqual({ ok: true });
    expect(prismaMock.movie.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '1' },
        data: expect.objectContaining({
          title: 'Updated',
          genres: expect.any(Object),
          language: expect.any(Object),
        }),
      }),
    );
  });

  it('should throw if user is not the creator (update)', async () => {
    prismaMock.movie.findFirst = jest.fn().mockResolvedValue({
      createdById: 'other',
      genres: [],
    });
    await expect(service.update('1', {}, 'user1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete movie if user is creator', async () => {
    prismaMock.movie.findFirst = jest
      .fn()
      .mockResolvedValue({ createdById: 'user1' });
    prismaMock.movie.delete = jest.fn().mockResolvedValue({});
    const result = await service.remove('1', 'user1');
    expect(result).toEqual({ ok: true });
    expect(prismaMock.movie.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should throw if movie not found (remove)', async () => {
    prismaMock.movie.findFirst = jest.fn().mockResolvedValue(null);
    await expect(service.remove('1', 'user1')).rejects.toThrowError(
      expect.objectContaining({
        message: 'Filme não encontrado',
        name: 'NotFoundException',
      }),
    );
  });

  it('should throw if user is not the creator (remove)', async () => {
    prismaMock.movie.findFirst = jest
      .fn()
      .mockResolvedValue({ createdById: 'other' });
    await expect(service.remove('1', 'user1')).rejects.toThrowError(
      expect.objectContaining({
        message: 'Você não tem permissão para deletar este filme',
        name: 'NotFoundException',
      }),
    );
  });
});
