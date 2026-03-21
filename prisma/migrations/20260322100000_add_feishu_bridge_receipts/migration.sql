-- CreateTable
CREATE TABLE "feishu_bridge_receipts" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "messageId" TEXT,
    "chatId" TEXT,
    "commandType" TEXT,
    "status" TEXT NOT NULL,
    "replyText" TEXT,
    "workflowId" TEXT,
    "executionId" TEXT,
    "draftWorkflowId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feishu_bridge_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feishu_bridge_receipts_eventId_key" ON "feishu_bridge_receipts"("eventId");

-- CreateIndex
CREATE INDEX "feishu_bridge_receipts_messageId_idx" ON "feishu_bridge_receipts"("messageId");

-- CreateIndex
CREATE INDEX "feishu_bridge_receipts_chatId_createdAt_idx" ON "feishu_bridge_receipts"("chatId", "createdAt");
