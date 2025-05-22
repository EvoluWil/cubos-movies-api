import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  create(
    @Body() createMovieDto: CreateMovieDto,
    @AuthUser() user: Request['user'],
  ) {
    return this.movieService.create(createMovieDto, user.id);
  }

  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @AuthUser() user: Request['user'],
  ) {
    return this.movieService.update(id, updateMovieDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: Request['user']) {
    return this.movieService.remove(id, user.id);
  }
}
