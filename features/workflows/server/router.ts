import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import { generateSlug } from "random-word-slugs"
import z from "zod";

export const workflowsRouter = createTRPCRouter({
    create: protectedProcedure.mutation(({ ctx }) => {
        return prisma.workflow.create({
            data: {
                name: generateSlug(3),
                userId: ctx.user.id
            }
        })
    }),
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ ctx, input }) => {
        return prisma.workflow.deleteMany({
            where: {
                userId: ctx.user.id,
                id: input.id
            }
        })
    }),
    updateName: protectedProcedure
        .input(z.object({ id: z.string(), name: z.string().min(1) }))
        .mutation(({ ctx, input }) => {
            return prisma.workflow.updateMany({
                where: {
                    id: input.id,
                    userId: ctx.user.id,
                },
                data: {
                    name: input.name
                }
            })
        }),
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(({ ctx, input }) => {
            return prisma.workflow.findFirst({
                where: {
                    id: input.id,
                    userId: ctx.user.id,
                }
            })
        }),
    getMany: protectedProcedure
        .query(({ ctx }) => {
            return prisma.workflow.findMany({
                where: {
                    userId: ctx.user.id,
                },
                orderBy: {
                    updatedAt: "desc"
                }
            })
        }),
})