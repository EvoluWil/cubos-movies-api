/*
  Warnings:

  - You are about to drop the column `rating` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the `_movie_genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_movie_languages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `duration` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageId` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalTitle` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quality` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `synopsis` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_movie_genres" DROP CONSTRAINT "_movie_genres_A_fkey";

-- DropForeignKey
ALTER TABLE "_movie_genres" DROP CONSTRAINT "_movie_genres_B_fkey";

-- DropForeignKey
ALTER TABLE "_movie_languages" DROP CONSTRAINT "_movie_languages_A_fkey";

-- DropForeignKey
ALTER TABLE "_movie_languages" DROP CONSTRAINT "_movie_languages_B_fkey";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "rating",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "languageId" TEXT NOT NULL,
ADD COLUMN     "originalTitle" TEXT NOT NULL,
ADD COLUMN     "quality" INTEGER NOT NULL,
ADD COLUMN     "synopsis" TEXT NOT NULL;

-- DropTable
DROP TABLE "_movie_genres";

-- DropTable
DROP TABLE "_movie_languages";

-- CreateTable
CREATE TABLE "_GenreToMovie" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GenreToMovie_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GenreToMovie_B_index" ON "_GenreToMovie"("B");

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToMovie" ADD CONSTRAINT "_GenreToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToMovie" ADD CONSTRAINT "_GenreToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
