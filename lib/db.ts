import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** True when a database is configured (Neon in Vercel, local Postgres in dev). */
export const hasDatabase = Boolean(process.env.DATABASE_URL);

/**
 * Shared Prisma client. Reused across hot reloads in dev so we don't exhaust connections.
 * Throws if DATABASE_URL is missing — check `hasDatabase` first where a fallback is allowed.
 */
export function db(): PrismaClient {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    });
  }
  return globalForPrisma.prisma;
}
