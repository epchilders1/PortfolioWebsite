-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "precedence" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tags" TEXT[];
