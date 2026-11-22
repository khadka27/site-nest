import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var redisGlobal: Redis | undefined;
}

function getRedisInstance(): Redis | null {
  if (globalThis.redisGlobal) return globalThis.redisGlobal;

  const socketPath = process.env.REDIS_SOCKET;
  const redisUrl = process.env.REDIS_URL;

  try {
    let client: Redis;
    if (socketPath && require("fs").existsSync(socketPath)) {
      client = new Redis({
        path: socketPath,
        maxRetriesPerRequest: 1,
        lazyConnect: true,
      });
    } else if (redisUrl) {
      client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        lazyConnect: true,
      });
    } else {
      return null;
    }

    client.on("error", (err) => {
      // Graceful log; doesn't crash Next.js
      if (process.env.NODE_ENV !== "test") {
        console.warn("[Redis] Connection error or offline:", err.message);
      }
    });

    if (process.env.NODE_ENV !== "production") {
      globalThis.redisGlobal = client;
    }
    return client;
  } catch {
    return null;
  }
}

export const redis = getRedisInstance();
