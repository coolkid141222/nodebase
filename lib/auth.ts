import "server-only";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  githubAuthConfig,
  googleAuthConfig,
  isEmailSignupAllowed,
} from "@/lib/auth-config";
import prisma from "@/lib/db";

const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
const betterAuthBaseURL = process.env.BETTER_AUTH_URL;
const socialProviders = {
  ...(googleAuthConfig
    ? {
        google: googleAuthConfig,
      }
    : {}),
  ...(githubAuthConfig
    ? {
        github: githubAuthConfig,
      }
    : {}),
};

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
  trustedOrigins: async (request) => {
    const origins = new Set<string>([
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ]);

    if (betterAuthBaseURL) {
      origins.add(betterAuthBaseURL);
    }

    if (request) {
      origins.add(new URL(request.url).origin);
    }

    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      origins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
    }

    return Array.from(origins);
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  ...(Object.keys(socialProviders).length > 0
    ? {
        socialProviders,
      }
    : {}),
  emailAndPassword: {
    enabled: true,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const email = ctx.body?.email;

      if (typeof email !== "string" || !isEmailSignupAllowed(email)) {
        throw new APIError("FORBIDDEN", {
          message:
            "Email sign-up is restricted. Continue with Google or GitHub instead.",
        });
      }
    }),
  },
});
