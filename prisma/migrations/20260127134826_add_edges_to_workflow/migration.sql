-- AlterTable
ALTER TABLE "workflow" ADD COLUMN     "edges" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "nodes" JSONB NOT NULL DEFAULT '[]';
