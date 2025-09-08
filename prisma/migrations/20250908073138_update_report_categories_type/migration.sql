/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `template_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the `answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category_reports` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categories` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_category_report_id_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_question_id_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_template_id_fkey";

-- DropForeignKey
ALTER TABLE "category_reports" DROP CONSTRAINT "category_reports_category_id_fkey";

-- DropForeignKey
ALTER TABLE "category_reports" DROP CONSTRAINT "category_reports_report_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_category_id_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_template_id_fkey";

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "deleted_at",
DROP COLUMN "template_id",
ADD COLUMN     "categories" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "templates" DROP COLUMN "deleted_at";

-- DropTable
DROP TABLE "answers";

-- DropTable
DROP TABLE "category_reports";

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
