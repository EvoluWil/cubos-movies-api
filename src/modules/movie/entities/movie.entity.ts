import { Movie } from '@prisma/client';

export class MovieEntity implements Movie {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  videoUrl: string;
  popularity: number;
  votes: number;
  rating: number;
  budget: number;
  revenue: number;
  releaseAt: Date;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}
