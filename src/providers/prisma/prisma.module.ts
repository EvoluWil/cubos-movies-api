import { Global, Module } from '@nestjs/common';
import { Querybuilder } from 'nestjs-prisma-querybuilder';
import { QueryBuilderService } from './prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [],
  providers: [PrismaService, QueryBuilderService, Querybuilder],
  exports: [PrismaService, QueryBuilderService],
})
export class PrismaModule {}
