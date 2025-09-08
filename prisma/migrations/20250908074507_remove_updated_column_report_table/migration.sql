/*
  Warnings:

  - You are about to drop the column `updated_at` on the `reports` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "templates" DROP CONSTRAINT "templates_user_id_fkey";

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "updated_at";

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
