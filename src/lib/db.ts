import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Lazy on purpose: constructing eagerly at module scope makes Next.js's build-time
// "collecting page data" step (which imports every route module) throw when
// DATABASE_URL isn't set, even for routes marked force-dynamic that never run at
// build time. Deferring construction until a query actually happens avoids that.
function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add your Neon connection string to .env");
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export function getPrisma(): PrismaClient {
  if (!globalThis.__prisma) {
    globalThis.__prisma = createClient();
  }
  return globalThis.__prisma;
}
