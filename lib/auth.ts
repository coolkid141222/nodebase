import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";

const betterAuthBaseURL = process.env.BETTER_AUTH_URL;
const betterAuthSecret = process.env.BETTER_AUTH_SECRET;

export const auth = betterAuth({
  ...(betterAuthBaseURL
    ? {
        baseURL: betterAuthBaseURL,
      }
    : {}),
  ...(betterAuthSecret
    ? {
        secret: betterAuthSecret,
      }
    : {}),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
