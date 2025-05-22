import { Movie } from '@prisma/client';

export class MovieEntity implements Movie {
  id: string;
  title: string;
  originalTitle: string;
  description: string;
  synopsis: string;
  coverUrl: string;
  videoUrl: string;
  duration: number;
  popularity: number;
  votes: number;
  quality: number;
  budget: number;
  revenue: number;
  releaseAt: Date;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  languageId: string;
}
