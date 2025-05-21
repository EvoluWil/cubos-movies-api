/*
  Warnings:

  - You are about to drop the column `tokenUpdatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updateToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "tokenUpdatedAt",
DROP COLUMN "updateToken",
ADD COLUMN     "codeCreatedAt" TIMESTAMP(3),
ADD COLUMN     "codeVerification" TEXT,
ADD COLUMN     "updatePasswordToken" TEXT,
ADD COLUMN     "updatePasswordTokenCreatedAt" TIMESTAMP(3);
