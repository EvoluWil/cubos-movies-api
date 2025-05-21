-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_createdById_fkey";

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
