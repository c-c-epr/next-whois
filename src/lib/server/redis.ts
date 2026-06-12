import Redis from "ioredis";

export const REDIS_HOST = process.env.REDIS_HOST as string;
export const REDIS_PORT = parseRedisNumberEnv("REDIS_PORT", 6379);
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const REDIS_DB = parseRedisNumberEnv("REDIS_DB", 0);
export const REDIS_CACHE_TTL = parseRedisNumberEnv("REDIS_CACHE_TTL", 3600);

export const REDIS_CONNECT_TIMEOUT_MS = parseRedisNumberEnv(
  "REDIS_CONNECT_TIMEOUT_MS",
  1000,
);
export const REDIS_RETRY_DELAY_MS = parseRedisNumberEnv(
  "REDIS_RETRY_DELAY_MS",
  100,
);
export const REDIS_RETRY_BACKOFF_MS = parseRedisNumberEnv(
  "REDIS_RETRY_BACKOFF_MS",
  30000,
);

let redisCacheAvailable = true;
let redisCacheRetryAfter = 0;

export const redis = createRedisConn();

function parseRedisNumberEnv(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) return defaultValue;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : defaultValue;
}

function shouldTryRedisCache(): boolean {
  return redisCacheAvailable || Date.now() >= redisCacheRetryAfter;
}

function markRedisCacheUnavailable(message: string, error: unknown): void {
  redisCacheRetryAfter = Date.now() + REDIS_RETRY_BACKOFF_MS;

  if (!redisCacheAvailable) return;

  redisCacheAvailable = false;
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.warn(`${message} ${errorMessage}`);
}

function markRedisCacheAvailable(): void {
  if (redisCacheAvailable) return;

  redisCacheAvailable = true;
  redisCacheRetryAfter = 0;
  console.info("Redis cache connection recovered.");
}

function createRedisConn(): Redis | undefined {
  if (REDIS_HOST) {
    try {
      const client = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
        db: REDIS_DB,
        connectTimeout: REDIS_CONNECT_TIMEOUT_MS,
        enableOfflineQueue: false,
        maxRetriesPerRequest: 1,
        retryStrategy(times) {
          return times > 1 ? null : REDIS_RETRY_DELAY_MS;
        },
      });

      client.on("error", (error) => {
        markRedisCacheUnavailable(
          "Redis cache connection error; continuing without cache:",
          error,
        );
      });
      client.on("ready", markRedisCacheAvailable);

      return client;
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
    }
  }
}

export async function getRedisValue(key: string): Promise<string | null> {
  if (redis && shouldTryRedisCache()) {
    try {
      const res = await redis.get(key);
      markRedisCacheAvailable();

      if (res !== null) {
        console.info(`Redis cache hit (value length: ${res.length})`);
        return res;
      }
    } catch (error) {
      markRedisCacheUnavailable(
        "Failed to read from Redis cache; skipping cache:",
        error,
      );
    }
  }

  return null;
}

export async function setRedisValue(
  key: string,
  value: string,
): Promise<boolean> {
  if (redis && shouldTryRedisCache()) {
    try {
      const result =
        REDIS_CACHE_TTL > 0
          ? await redis.set(key, value, "EX", REDIS_CACHE_TTL)
          : await redis.set(key, value);

      if (result === "OK") {
        markRedisCacheAvailable();
        console.info(
          `Redis cache set (value length: ${value.length}, ttl: ${REDIS_CACHE_TTL})`,
        );
        return true;
      }
    } catch (error) {
      markRedisCacheUnavailable(
        "Failed to write to Redis cache; skipping cache:",
        error,
      );
    }
  }
  return false;
}

export async function getJsonRedisValue<T>(key: string): Promise<T | null> {
  const res = await getRedisValue(key);
  if (res === null || res.trim() === "") return null;

  try {
    return JSON.parse(res) as T;
  } catch (error) {
    console.error("Failed to parse JSON from Redis:", error);
    return null;
  }
}

export async function setJsonRedisValue<T>(
  key: string,
  value: T,
): Promise<boolean> {
  try {
    return await setRedisValue(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to stringify JSON for Redis:", error);
    return false;
  }
}
