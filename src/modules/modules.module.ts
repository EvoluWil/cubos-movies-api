import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { GenreModule } from './genre/genre.module';
import { LanguageModule } from './language/language.module';

@Module({
  imports: [MovieModule, GenreModule, LanguageModule],
  providers: [],
  exports: [],
})
export class ModulesModule {}
