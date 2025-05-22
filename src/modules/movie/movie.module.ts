import { Module } from '@nestjs/common';
import { UploadService } from 'src/providers/upload/upload.service';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService, UploadService],
})
export class MovieModule {}
