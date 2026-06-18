import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type { PoolConfig } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const poolConfig: PoolConfig = {
    connectionString: process.env["DATABASE_URL"]!,
    max: 20,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    allowExitOnIdle: true,
  };
  const adapter = new PrismaPg(poolConfig, {
    onPoolError: (err) => {
      console.error("Prisma pool error:", err);
    },
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env["NODE_ENV"] !== "production") globalForPrisma.prisma = prisma;
