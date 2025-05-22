import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [MovieModule],
  providers: [],
  exports: [],
})
export class ModulesModule {}
