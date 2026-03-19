CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE "workflows" ADD COLUMN IF NOT EXISTS "webhookSecret" TEXT;

UPDATE "workflows"
SET "webhookSecret" = COALESCE("webhookSecret", gen_random_uuid()::text);

ALTER TABLE "workflows"
ALTER COLUMN "webhookSecret" SET DEFAULT gen_random_uuid()::text,
ALTER COLUMN "webhookSecret" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "workflows_webhookSecret_key" ON "workflows"("webhookSecret");
