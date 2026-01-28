import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import { generateSlug } from "random-word-slugs"
import z from "zod";
import { PAGINATION } from "@/config/constants";
import type { Node, Edge } from "@xyflow/react"
import { NodeType } from "@/types/workflow"

export const workflowsRouter = createTRPCRouter({
    create: protectedProcedure.mutation(({ ctx }) => {
        return prisma.workflow.create({
            data: {
                name: generateSlug(3),
                userId: ctx.user.id,
                nodes: {
                    create: {
                        type: "INITIAL",
                        position: { x: 0, y: 0 },
                        name: "Initial",
                    }
                }
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
            return prisma.workflow.update({
                where: {
                    id: input.id,
                    userId: ctx.user.id,
                },
                data: {
                    name: input.name
                }
            })
        }),
    update: protectedProcedure
        .input(
            z.object({ 
                id: z.string(),
                nodes: z.array(
                    z.object({
                        id: z.string(),
                        type: z.string().nullish(),
                        position: z.object({ x: z.number(), y: z.number() }),
                        data: z.record(z.string(), z.any()).optional()
                    })
                ),
                edges: z.array(
                    z.object({
                        source: z.string(),
                        target: z.string(),
                        sourceHandle: z.string().nullish(),
                        targetHandle: z.string().nullish(),

                    })
                )
            }))
        .mutation(async ({ ctx, input }) => {
            const { id, nodes, edges } = input
            
            const workflow = await prisma.workflow.findUnique({
                where: { id, userId: ctx.user.id }
            })

            return await prisma.$transaction(async (tx) => {
                await tx.node.deleteMany({
                    where: { workflowId: id },
                })

                await tx.node.createMany({
                    data: nodes
                        .filter((node) => node.type !== null && node.type !== undefined)
                        .map((node) => ({
                        id: node.id,
                        workflowId: id,
                        name: node.type!,
                        type: node.type! as NodeType,
                        position: node.position,
                        data: node.data || {}
                    }))
                })

                await tx.connection.createMany({
                    data: edges.map((edge) => ({
                        workflowId: id,
                        fromNodeId: edge.source,
                        toNodeId: edge.target,
                        fromOutput: edge.sourceHandle || "main",
                        toInput: edge.targetHandle || "main"
                    }))
                })

                await tx.workflow.update({
                    where: { id },
                    data: {
                        updatedAt: new Date()
                    }
                })
                return workflow
            })
        }),
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: input.id,
                    userId: ctx.user.id,
                },
                include: {
                    nodes: true,
                    connections: true,
                }
            })

            const nodes: Node[] = workflow.nodes.map((node) => ({
                id: node.id,
                type: node.type,
                position: node.position as {x: number, y: number},
                data: (node.data as Record<string, unknown>) || {}, 
            }))

            const edges: Edge[] = workflow.connections.map((connection) => ({
                id: connection.id,
                source: connection.fromNodeId,
                target: connection.toNodeId,
                sourceHandle: connection.fromOutput,
                targetHandle: connection.toInput,
            }))

            return {
                id: workflow.id,
                name: workflow.name,
                nodes,
                edges,
            }
        }),
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(PAGINATION.DEFAULT_PAGE),
            pageSize: z.number()
                .min(PAGINATION.MIN_PAGE_SIZE)
                .max(PAGINATION.MAX_PAGE_SIZE)
                .default(PAGINATION.DEFAULT_PAGE_SIZE),
            search: z.string().default(""),
        }))
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search } = input;

            const [items, totalCount] = await Promise.all([
                prisma.workflow.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    where: {
                        userId: ctx.user.id,
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    orderBy: {
                        updatedAt: "desc"
                    }
                }),
                prisma.workflow.count({
                    where: {
                        userId: ctx.user.id,
                    }
                }),
            ])
            const totalPages = Math.ceil(totalCount / pageSize);
            const hasMore = page < totalPages;
            const hasPrevious = page > 1;

            return {
                item: items,
                page,
                pageSize,
                totalCount,
                totalPages,
                hasMore,
                hasPrevious,
            }
        }),
})