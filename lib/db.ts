import "server-only";
import "dotenv/config";
import { PrismaClient } from "./prisma/client/index.js";

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;
