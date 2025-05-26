/*
  Warnings:

  - You are about to drop the column `description` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the column `quality` on the `movies` table. All the data in the column will be lost.
  - Added the required column `backdropUrl` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promotionalText` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "description",
DROP COLUMN "quality",
ADD COLUMN     "backdropUrl" TEXT NOT NULL,
ADD COLUMN     "promotionalText" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL;
