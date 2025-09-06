/*
  Warnings:

  - Added the required column `name` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL;
