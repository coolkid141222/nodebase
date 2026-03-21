-- CreateEnum
CREATE TYPE "PersistentMemoryScope" AS ENUM ('WORKFLOW', 'USER');

-- AlterTable
ALTER TABLE "workflows" ALTER COLUMN "webhookSecret" DROP DEFAULT;

-- CreateTable
CREATE TABLE "persistent_memory_entries" (
    "id" TEXT NOT NULL,
    "scope" "PersistentMemoryScope" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workflowId" TEXT,
    "namespace" TEXT NOT NULL DEFAULT 'default',
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "textValue" TEXT,
    "embedding" JSONB,
    "embeddingProvider" "CredentialProvider",
    "embeddingModel" TEXT,
    "sourceExecutionId" TEXT,
    "sourceStepId" TEXT,
    "sourceNodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persistent_memory_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "persistent_memory_entries_userId_scope_ownerId_updatedAt_idx" ON "persistent_memory_entries"("userId", "scope", "ownerId", "updatedAt");

-- CreateIndex
CREATE INDEX "persistent_memory_entries_workflowId_updatedAt_idx" ON "persistent_memory_entries"("workflowId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "persistent_memory_entries_scope_ownerId_namespace_key_key" ON "persistent_memory_entries"("scope", "ownerId", "namespace", "key");

-- AddForeignKey
ALTER TABLE "persistent_memory_entries" ADD CONSTRAINT "persistent_memory_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persistent_memory_entries" ADD CONSTRAINT "persistent_memory_entries_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "execution_memory_entries_executionId_scope_ownerNodeId_namespa_" RENAME TO "execution_memory_entries_executionId_scope_ownerNodeId_name_key";

-- RenameIndex
ALTER INDEX "execution_memory_entries_executionId_scope_ownerNodeId_updatedA" RENAME TO "execution_memory_entries_executionId_scope_ownerNodeId_upda_idx";
