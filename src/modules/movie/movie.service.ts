import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBuilderService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UploadService } from 'src/providers/upload/upload.service';
import { getYouTubeUrl } from 'src/utils/get-youtube-url.util';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QueryBuilderService,
    private readonly upload: UploadService,
  ) {}

  async create(createMovieDto: CreateMovieDto, userId: string) {
    const {
      genreIds,
      languageId,
      coverBase64,
      videoYouTubeId,
      backdropBase64,
      ...rest
    } = createMovieDto;

    const videoUrl = getYouTubeUrl(videoYouTubeId);

    const coverUrl = await this.upload.uploadBase64Image(coverBase64);

    if (!coverUrl) {
      throw new NotFoundException('Erro ao fazer upload da imagem');
    }

    const backdropUrl = await this.upload.uploadBase64Image(backdropBase64);
    if (!backdropUrl) {
      throw new NotFoundException('Erro ao fazer upload do backdrop');
    }

    await this.prisma.movie.create({
      data: {
        ...rest,
        coverUrl,
        videoUrl,
        backdropUrl,
        genres: {
          connect: genreIds.map((id) => ({ id })),
        },
        language: {
          connect: { id: languageId },
        },
        createdBy: {
          connect: { id: userId },
        },
      },
    });

    return { ok: true };
  }

  async findAll() {
    const query = await this.qb.query('movie');
    console.log('query', query);
    const movies = await this.prisma.movie.findMany({
      ...query,
      select: {
        id: true,
        title: true,
        rating: true,
        coverUrl: true,
        genres: true,
      },
    });

    const total = await this.prisma.movie.count({
      where: {
        ...query.where,
      },
    });

    return {
      movies,
      total,
    };
  }

  async findOne(id: string) {
    const movie = await this.prisma.movie.findFirst({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Filme não encontrado');
    }

    return this.prisma.movie.findFirst({
      where: { id },
      include: {
        genres: true,
        language: true,
      },
    });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto, userId: string) {
    const movie = await this.prisma.movie.findFirst({
      where: { id },
      select: {
        createdById: true,
        videoUrl: true,
        coverUrl: true,
        backdropUrl: true,
        genres: true,
      },
    });

    if (!movie) {
      throw new NotFoundException('Filme não encontrado');
    }

    if (movie?.createdById !== userId) {
      throw new NotFoundException(
        'Você não tem permissão para editar este filme',
      );
    }

    const {
      genreIds,
      languageId,
      coverBase64,
      videoYouTubeId,
      backdropBase64,
      ...rest
    } = updateMovieDto;

    const videoUrl = videoYouTubeId
      ? getYouTubeUrl(videoYouTubeId)
      : movie.videoUrl;

    const coverUrl = coverBase64
      ? await this.upload.uploadBase64Image(coverBase64)
      : movie.coverUrl;

    if (!coverUrl) {
      throw new NotFoundException('Erro ao fazer upload da imagem');
    }

    const backdropUrl = backdropBase64
      ? await this.upload.uploadBase64Image(backdropBase64)
      : movie.backdropUrl;

    if (!backdropUrl) {
      throw new NotFoundException('Erro ao fazer upload do backdrop');
    }

    const genreIdsToConnect = genreIds?.length
      ? genreIds?.filter((id) => !movie.genres.some((genre) => genre.id === id))
      : [];

    const genreIdsToDisconnect = genreIds?.length
      ? movie.genres.filter((genre) => !genreIds?.includes(genre.id))
      : [];

    await this.prisma.movie.update({
      where: { id },
      data: {
        ...rest,
        coverUrl,
        videoUrl,
        genres: {
          connect: genreIdsToConnect.map((id) => ({ id })),
          disconnect: genreIdsToDisconnect.map((genre) => ({ id: genre.id })),
        },
        language: languageId
          ? {
              connect: { id: languageId },
            }
          : undefined,
      },
    });

    return { ok: true };
  }

  async remove(id: string, userId: string) {
    const movie = await this.prisma.movie.findFirst({
      where: { id },
      select: {
        createdById: true,
      },
    });

    if (!movie) {
      throw new NotFoundException('Filme não encontrado');
    }

    if (movie?.createdById !== userId) {
      throw new NotFoundException(
        'Você não tem permissão para deletar este filme',
      );
    }

    await this.prisma.movie.delete({
      where: { id },
    });

    return { ok: true };
  }
}
