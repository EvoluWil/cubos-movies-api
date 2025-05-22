import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBuilderService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UploadService } from 'src/providers/upload/upload.service';
import { getYouTubeUrl } from 'src/utils/get-you-tube-url.util';
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
    const { genreIds, languageId, coverBase64, videoYouTubeId, ...rest } =
      createMovieDto;

    const videoUrl = getYouTubeUrl(videoYouTubeId);

    const coverUrl = await this.upload.uploadBase64Image(coverBase64);

    await this.prisma.movie.create({
      data: {
        ...rest,
        coverUrl,
        videoUrl,
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
    return this.prisma.movie.findMany({
      ...query,
      select: {
        id: true,
        title: true,
        quality: true,
        coverUrl: true,
        genres: true,
      },
    });
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

    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
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
