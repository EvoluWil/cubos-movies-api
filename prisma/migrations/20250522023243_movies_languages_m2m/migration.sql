/*
  Warnings:

  - You are about to drop the column `genreId` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `movies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_genreId_fkey";

-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_languageId_fkey";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "genreId",
DROP COLUMN "languageId";

-- CreateTable
CREATE TABLE "_movie_genre" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_movie_genre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_movie_languages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_movie_languages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_movie_genre_B_index" ON "_movie_genre"("B");

-- CreateIndex
CREATE INDEX "_movie_languages_B_index" ON "_movie_languages"("B");

-- AddForeignKey
ALTER TABLE "_movie_genre" ADD CONSTRAINT "_movie_genre_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_movie_genre" ADD CONSTRAINT "_movie_genre_B_fkey" FOREIGN KEY ("B") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_movie_languages" ADD CONSTRAINT "_movie_languages_A_fkey" FOREIGN KEY ("A") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_movie_languages" ADD CONSTRAINT "_movie_languages_B_fkey" FOREIGN KEY ("B") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
