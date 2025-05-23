import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsYouTubeId } from 'src/decorators/you-tube-id.decorator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  originalTitle: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  synopsis: string;

  @IsString()
  @IsNotEmpty()
  coverBase64: string;

  @IsString()
  @IsYouTubeId()
  @IsNotEmpty()
  videoYouTubeId: string;

  @IsNumber()
  @IsNotEmpty()
  popularity: number;

  @IsNumber()
  @IsNotEmpty()
  votes: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  quality: number;

  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @IsNumber()
  @IsNotEmpty()
  revenue: number;

  @IsDateString()
  @IsNotEmpty()
  releaseAt: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  genreIds: string[];

  @IsString()
  @IsUUID(4)
  languageId: string;
}
