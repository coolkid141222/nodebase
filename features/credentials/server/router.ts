import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { CredentialProvider } from "@/lib/prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
  formatCredentialSecretForForm,
  serializeCredentialSecret,
} from "./payload";

const credentialInput = z.object({
  name: z.string().trim().min(1).max(120),
  provider: z.nativeEnum(CredentialProvider),
  description: z.string().trim().max(500).optional().default(""),
  secretJson: z.string().min(2),
});

export const credentialsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    return prisma.credential.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const credential = await prisma.credential.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!credential) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Credential not found.",
        });
      }

      let secretJson: string;
      try {
        secretJson = formatCredentialSecretForForm(credential.encryptedData);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to decrypt credential.",
        });
      }

      return {
        ...credential,
        secretJson,
      };
    }),
  create: protectedProcedure
    .input(credentialInput)
    .mutation(async ({ ctx, input }) => {
      let serialized;
      try {
        serialized = serializeCredentialSecret(input.secretJson);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Invalid credential secret JSON.",
        });
      }

      return prisma.credential.create({
        data: {
          userId: ctx.user.id,
          name: input.name,
          provider: input.provider,
          description: input.description || null,
          encryptedData: serialized.encryptedData,
          metadata: serialized.metadata,
        },
      });
    }),
  update: protectedProcedure
    .input(
      credentialInput.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.credential.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Credential not found.",
        });
      }

      let serialized;
      try {
        serialized = serializeCredentialSecret(input.secretJson);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Invalid credential secret JSON.",
        });
      }

      await prisma.credential.update({
        where: {
          id: existing.id,
        },
        data: {
          name: input.name,
          provider: input.provider,
          description: input.description || null,
          encryptedData: serialized.encryptedData,
          metadata: serialized.metadata,
        },
      });

      return prisma.credential.findUniqueOrThrow({
        where: {
          id: existing.id,
        },
      });
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.credential.deleteMany({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });
    }),
});
