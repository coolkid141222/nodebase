DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BillingPlan') THEN
        CREATE TYPE "BillingPlan" AS ENUM ('FREE', 'PRO');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BillingProvider') THEN
        CREATE TYPE "BillingProvider" AS ENUM ('MOCK', 'PADDLE');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BillingStatus') THEN
        CREATE TYPE "BillingStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'CANCELED');
    END IF;
END $$;

ALTER TABLE "user"
    ADD COLUMN IF NOT EXISTS "plan" "BillingPlan" NOT NULL DEFAULT 'FREE',
    ADD COLUMN IF NOT EXISTS "billingProvider" "BillingProvider",
    ADD COLUMN IF NOT EXISTS "billingStatus" "BillingStatus" NOT NULL DEFAULT 'INACTIVE',
    ADD COLUMN IF NOT EXISTS "billingCustomerId" TEXT,
    ADD COLUMN IF NOT EXISTS "billingSubscriptionId" TEXT,
    ADD COLUMN IF NOT EXISTS "billingCurrentPeriodEnd" TIMESTAMP(3);
