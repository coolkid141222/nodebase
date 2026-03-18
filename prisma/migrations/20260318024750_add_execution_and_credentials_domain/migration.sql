-- CreateEnum
CREATE TYPE "CredentialProvider" AS ENUM ('OPENAI', 'ANTHROPIC', 'GOOGLE', 'DISCORD', 'SLACK', 'STRIPE', 'POLAR');

-- CreateEnum
CREATE TYPE "ExecutionTriggerType" AS ENUM ('MANUAL', 'WEBHOOK', 'GOOGLE_FORM', 'STRIPE');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ExecutionStepStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'SKIPPED');

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" "CredentialProvider" NOT NULL,
    "description" TEXT,
    "encryptedData" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "executions" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "triggerType" "ExecutionTriggerType" NOT NULL,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "triggeredByUserId" TEXT,
    "triggerPayload" JSONB NOT NULL DEFAULT '{}',
    "state" JSONB NOT NULL DEFAULT '{}',
    "workflowSnapshot" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "error" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "execution_steps" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "nodeId" TEXT,
    "nodeName" TEXT NOT NULL,
    "nodeType" "NodeType" NOT NULL,
    "status" "ExecutionStepStatus" NOT NULL DEFAULT 'PENDING',
    "position" INTEGER NOT NULL,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "input" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB,
    "error" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "execution_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "credentials_userId_provider_idx" ON "credentials"("userId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_userId_name_key" ON "credentials"("userId", "name");

-- CreateIndex
CREATE INDEX "executions_workflowId_createdAt_idx" ON "executions"("workflowId", "createdAt");

-- CreateIndex
CREATE INDEX "executions_triggeredByUserId_createdAt_idx" ON "executions"("triggeredByUserId", "createdAt");

-- CreateIndex
CREATE INDEX "executions_status_createdAt_idx" ON "executions"("status", "createdAt");

-- CreateIndex
CREATE INDEX "execution_steps_executionId_position_idx" ON "execution_steps"("executionId", "position");

-- CreateIndex
CREATE INDEX "execution_steps_nodeId_idx" ON "execution_steps"("nodeId");

-- CreateIndex
CREATE INDEX "execution_steps_status_createdAt_idx" ON "execution_steps"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD CONSTRAINT "executions_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD CONSTRAINT "executions_triggeredByUserId_fkey" FOREIGN KEY ("triggeredByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution_steps" ADD CONSTRAINT "execution_steps_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution_steps" ADD CONSTRAINT "execution_steps_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
