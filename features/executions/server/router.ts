import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import type { Prisma } from "@/lib/prisma/client";
import { ExecutionStatus, PersistentMemoryScope } from "@/lib/prisma/client";
import {
  createManualExecution,
  runExecution,
  WorkflowExecutionError,
} from "./execution-runner";

function canUseInngestQueue() {
  return Boolean(process.env.INNGEST_EVENT_KEY?.trim());
}

export const executionsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    return prisma.execution.findMany({
      where: {
        workflow: {
          userId: ctx.user.id,
        },
      },
      include: {
        workflow: {
          select: {
            id: true,
            name: true,
          },
        },
        steps: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });
  }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const execution = await prisma.execution.findFirst({
        where: {
          id: input.id,
          workflow: {
            userId: ctx.user.id,
          },
        },
        include: {
          workflow: {
            select: {
              id: true,
              name: true,
            },
          },
          steps: {
            orderBy: {
              position: "asc",
            },
          },
          memoryEntries: {
            orderBy: [
              { scope: "asc" },
              { namespace: "asc" },
              { key: "asc" },
            ],
          },
          memoryEvents: {
            orderBy: {
              createdAt: "asc",
            },
            take: 200,
          },
        },
      });

      if (!execution) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Execution not found.",
        });
      }

      return execution;
    }),
  getLatestForWorkflow: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.execution.findFirst({
        where: {
          workflowId: input.workflowId,
          workflow: {
            userId: ctx.user.id,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          workflow: {
            select: {
              id: true,
              name: true,
            },
          },
          steps: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });
    }),
  triggerManual: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        message: z.string().trim().max(4_000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let executionId: string | null = null;

      try {
        const execution = await createManualExecution({
          workflowId: input.workflowId,
          triggeredByUserId: ctx.user.id,
          message: input.message,
        });

        if (!execution) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Workflow not found.",
          });
        }

        executionId = execution.id;

        const queued = canUseInngestQueue();

        if (queued) {
          await inngest.send({
            name: "workflow/manual.triggered",
            data: {
              executionId: execution.id,
              workflowId: execution.workflowId,
              triggeredByUserId: ctx.user.id,
            },
          });
        } else {
          const completedExecution = await runExecution(execution.id);

          return {
            id: execution.id,
            status: completedExecution?.status ?? execution.status,
            queued: false,
          };
        }

        return {
          id: execution.id,
          status: execution.status,
          queued: true,
        };
      } catch (error) {
        if (error instanceof WorkflowExecutionError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        if (executionId) {
          await prisma.execution.update({
            where: {
              id: executionId,
            },
            data: {
              status: ExecutionStatus.FAILED,
              completedAt: new Date(),
              error: {
                message:
                  error instanceof Error
                    ? error.message
                    : "Failed to queue workflow execution.",
              },
              state: {
                phase: "queue_failed",
              },
            },
          });
        }

        throw error;
      }
    }),
  getPersistentMemory: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const entries = await prisma.persistentMemoryEntry.findMany({
        where: {
          scope: PersistentMemoryScope.WORKFLOW,
          ownerId: input.workflowId,
          workflow: {
            userId: ctx.user.id,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 100,
      });

      return { entries };
    }),
  deletePersistentMemory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const entry = await prisma.persistentMemoryEntry.findFirst({
        where: {
          id: input.id,
          workflow: {
            userId: ctx.user.id,
          },
        },
      });

      if (!entry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Memory entry not found.",
        });
      }

      await prisma.persistentMemoryEntry.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
  updatePersistentMemory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        value: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const entry = await prisma.persistentMemoryEntry.findFirst({
        where: {
          id: input.id,
          workflow: {
            userId: ctx.user.id,
          },
        },
      });

      if (!entry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Memory entry not found.",
        });
      }

      await prisma.persistentMemoryEntry.update({
        where: { id: input.id },
        data: {
          value: input.value as Prisma.InputJsonValue,
          updatedAt: new Date(),
        },
      });

      return { success: true };
    }),
});
