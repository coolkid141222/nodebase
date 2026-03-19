import { BillingPlan, BillingProvider, BillingStatus } from "@/lib/prisma/client";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { MOCK_BILLING_PERIOD_DAYS } from "../shared";

const buildMockPeriodEnd = () => {
  const nextPeriodEnd = new Date();
  nextPeriodEnd.setDate(nextPeriodEnd.getDate() + MOCK_BILLING_PERIOD_DAYS);
  return nextPeriodEnd;
};

export const billingRouter = createTRPCRouter({
  getState: protectedProcedure.query(async ({ ctx }) => {
    return prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.user.id,
      },
      select: {
        plan: true,
        billingProvider: true,
        billingStatus: true,
        billingCustomerId: true,
        billingSubscriptionId: true,
        billingCurrentPeriodEnd: true,
      },
    });
  }),
  upgradeToPro: protectedProcedure.mutation(async ({ ctx }) => {
    return prisma.user.update({
      where: {
        id: ctx.user.id,
      },
      data: {
        plan: BillingPlan.PRO,
        billingProvider: BillingProvider.MOCK,
        billingStatus: BillingStatus.ACTIVE,
        billingCustomerId: null,
        billingSubscriptionId: null,
        billingCurrentPeriodEnd: buildMockPeriodEnd(),
      },
      select: {
        plan: true,
        billingProvider: true,
        billingStatus: true,
        billingCustomerId: true,
        billingSubscriptionId: true,
        billingCurrentPeriodEnd: true,
      },
    });
  }),
  downgradeToFree: protectedProcedure.mutation(async ({ ctx }) => {
    return prisma.user.update({
      where: {
        id: ctx.user.id,
      },
      data: {
        plan: BillingPlan.FREE,
        billingProvider: null,
        billingStatus: BillingStatus.INACTIVE,
        billingCustomerId: null,
        billingSubscriptionId: null,
        billingCurrentPeriodEnd: null,
      },
      select: {
        plan: true,
        billingProvider: true,
        billingStatus: true,
        billingCustomerId: true,
        billingSubscriptionId: true,
        billingCurrentPeriodEnd: true,
      },
    });
  }),
});
