/*
  Warnings:

  - You are about to drop the column `report_id` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `reports` table. All the data in the column will be lost.
  - Added the required column `category_report_id` to the `answers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_report_id_fkey";

-- AlterTable
ALTER TABLE "answers" DROP COLUMN "report_id",
ADD COLUMN     "category_report_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "images";

-- CreateTable
CREATE TABLE "category_reports" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "images" TEXT[],
    "comment" TEXT,

    CONSTRAINT "category_reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "category_reports" ADD CONSTRAINT "category_reports_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_reports" ADD CONSTRAINT "category_reports_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_category_report_id_fkey" FOREIGN KEY ("category_report_id") REFERENCES "category_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
