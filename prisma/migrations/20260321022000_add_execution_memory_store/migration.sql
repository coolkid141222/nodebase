CREATE TYPE "ExecutionMemoryScope" AS ENUM ('SHARED', 'NODE');

CREATE TYPE "ExecutionMemoryVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

CREATE TYPE "ExecutionMemoryWriteMode" AS ENUM ('REPLACE', 'MERGE', 'APPEND');

CREATE TABLE "execution_memory_entries" (
  "id" TEXT NOT NULL,
  "executionId" TEXT NOT NULL,
  "scope" "ExecutionMemoryScope" NOT NULL DEFAULT 'SHARED',
  "visibility" "ExecutionMemoryVisibility" NOT NULL DEFAULT 'PUBLIC',
  "ownerNodeId" TEXT NOT NULL DEFAULT '',
  "namespace" TEXT NOT NULL DEFAULT 'default',
  "key" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "sourceStepId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "execution_memory_entries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "execution_memory_events" (
  "id" TEXT NOT NULL,
  "executionId" TEXT NOT NULL,
  "stepId" TEXT,
  "nodeId" TEXT NOT NULL DEFAULT '',
  "scope" "ExecutionMemoryScope" NOT NULL,
  "visibility" "ExecutionMemoryVisibility" NOT NULL DEFAULT 'PUBLIC',
  "ownerNodeId" TEXT NOT NULL DEFAULT '',
  "namespace" TEXT NOT NULL DEFAULT 'default',
  "key" TEXT NOT NULL,
  "mode" "ExecutionMemoryWriteMode" NOT NULL DEFAULT 'REPLACE',
  "value" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "execution_memory_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "execution_memory_entries_executionId_scope_ownerNodeId_namespa_key" ON "execution_memory_entries"("executionId", "scope", "ownerNodeId", "namespace", "key");
CREATE INDEX "execution_memory_entries_executionId_scope_ownerNodeId_updatedA_idx" ON "execution_memory_entries"("executionId", "scope", "ownerNodeId", "updatedAt");
CREATE INDEX "execution_memory_entries_sourceStepId_idx" ON "execution_memory_entries"("sourceStepId");
CREATE INDEX "execution_memory_events_executionId_createdAt_idx" ON "execution_memory_events"("executionId", "createdAt");
CREATE INDEX "execution_memory_events_stepId_idx" ON "execution_memory_events"("stepId");
CREATE INDEX "execution_memory_events_nodeId_createdAt_idx" ON "execution_memory_events"("nodeId", "createdAt");

ALTER TABLE "execution_memory_entries" ADD CONSTRAINT "execution_memory_entries_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "execution_memory_events" ADD CONSTRAINT "execution_memory_events_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
