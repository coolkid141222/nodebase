import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";

const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
const betterAuthBaseURL = process.env.BETTER_AUTH_URL;

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
  trustedOrigins: async () => {
    const origins = new Set<string>([
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://*.vercel.app",
    ]);

    if (betterAuthBaseURL) {
      origins.add(betterAuthBaseURL);
    }

    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      origins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
    }

    return Array.from(origins);
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
