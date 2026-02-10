-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;
