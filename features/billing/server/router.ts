import { z } from "zod";
import { BillingPlan, BillingProvider, BillingStatus } from "@/lib/prisma/client";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { MOCK_BILLING_PERIOD_DAYS } from "../shared";
import {
  createPaddlePortalOverviewLink,
  ensurePaddleCustomer,
  getPaddleConfig,
} from "./paddle";

const buildMockPeriodEnd = () => {
  const nextPeriodEnd = new Date();
  nextPeriodEnd.setDate(nextPeriodEnd.getDate() + MOCK_BILLING_PERIOD_DAYS);
  return nextPeriodEnd;
};

export const billingRouter = createTRPCRouter({
  getState: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.user.id,
      },
      select: {
        name: true,
        email: true,
        plan: true,
        billingProvider: true,
        billingStatus: true,
        billingCustomerId: true,
        billingSubscriptionId: true,
        billingCurrentPeriodEnd: true,
      },
    });

    return {
      ...user,
      paddle: getPaddleConfig(),
    };
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
  syncPaddleCheckout: protectedProcedure
    .input(
      z.object({
        customerId: z.string().min(1),
        subscriptionId: z.string().min(1).optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          plan: BillingPlan.PRO,
          billingProvider: BillingProvider.PADDLE,
          billingStatus: BillingStatus.ACTIVE,
          billingCustomerId: input.customerId,
          billingSubscriptionId: input.subscriptionId ?? null,
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
  createPaddlePortalLink: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        billingCustomerId: true,
      },
    });

    const customerId = await ensurePaddleCustomer({
      existingCustomerId: user.billingCustomerId,
      email: user.email,
      name: user.name,
      userId: user.id,
    });

    if (customerId !== user.billingCustomerId) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          billingCustomerId: customerId,
        },
      });
    }

    const url = await createPaddlePortalOverviewLink({
      customerId,
    });

    return {
      url,
      customerId,
    };
  }),
});
