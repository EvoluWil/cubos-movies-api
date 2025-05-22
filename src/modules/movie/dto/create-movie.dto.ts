import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  coverBase64: string;

  @IsString()
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
  rating: number;

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
  @IsUUID(4, { each: true })
  genreIds: string[];

  @IsArray()
  @IsUUID(4, { each: true })
  languageIds: string[];
}
