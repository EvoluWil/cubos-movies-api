import { Movie } from '@prisma/client';

export class MovieEntity implements Movie {
  id: string;
  title: string;
  originalTitle: string;
  promotionalText: string;
  synopsis: string;
  coverUrl: string;
  backdropUrl: string;
  videoUrl: string;
  duration: number;
  popularity: number;
  votes: number;
  rating: number;
  budget: number;
  revenue: number;
  releaseAt: Date;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  languageId: string;
}
