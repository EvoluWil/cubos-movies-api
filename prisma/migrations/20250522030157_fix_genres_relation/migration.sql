/*
  Warnings:

  - You are about to drop the `_movie_genre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_movie_genre" DROP CONSTRAINT "_movie_genre_A_fkey";

-- DropForeignKey
ALTER TABLE "_movie_genre" DROP CONSTRAINT "_movie_genre_B_fkey";

-- DropTable
DROP TABLE "_movie_genre";

-- CreateTable
CREATE TABLE "_movie_genres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_movie_genres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_movie_genres_B_index" ON "_movie_genres"("B");

-- AddForeignKey
ALTER TABLE "_movie_genres" ADD CONSTRAINT "_movie_genres_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_movie_genres" ADD CONSTRAINT "_movie_genres_B_fkey" FOREIGN KEY ("B") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
