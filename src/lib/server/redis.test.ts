import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const redisMock = vi.hoisted(() => ({
  constructorOptions: [] as unknown[],
  get: vi.fn(),
  on: vi.fn(),
  set: vi.fn(),
}));

vi.mock("ioredis", () => {
  class MockRedis {
    get = redisMock.get;
    on = redisMock.on;
    set = redisMock.set;

    constructor(options: unknown) {
      redisMock.constructorOptions.push(options);
    }
  }

  return { default: MockRedis };
});

async function importRedisModule() {
  vi.stubEnv("REDIS_HOST", "localhost");
  vi.stubEnv("REDIS_PORT", "6379");
  vi.stubEnv("REDIS_DB", "0");
  vi.stubEnv("REDIS_CACHE_TTL", "3600");
  vi.stubEnv("REDIS_CONNECT_TIMEOUT_MS", "1000");
  vi.stubEnv("REDIS_RETRY_DELAY_MS", "100");
  vi.stubEnv("REDIS_RETRY_BACKOFF_MS", "30000");

  return await import("@/lib/server/redis");
}

describe("redis cache helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    redisMock.constructorOptions.length = 0;
    redisMock.get.mockReset();
    redisMock.on.mockReset();
    redisMock.set.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("creates Redis with fail-fast options", async () => {
    await importRedisModule();

    expect(redisMock.constructorOptions[0]).toMatchObject({
      connectTimeout: 1000,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
    });
  });

  it("returns null instead of rethrowing when Redis get fails", async () => {
    const error = new Error("connection down");
    redisMock.get.mockRejectedValueOnce(error);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { getRedisValue } = await importRedisModule();

    await expect(getRedisValue("whois:example.com")).resolves.toBeNull();

    expect(redisMock.get).toHaveBeenCalledWith("whois:example.com");
    expect(warnSpy).toHaveBeenCalledWith(
      "Failed to read from Redis cache; skipping cache: connection down",
    );
  });

  it("treats empty strings as cache hits", async () => {
    redisMock.get.mockResolvedValueOnce("");
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const { getRedisValue } = await importRedisModule();

    await expect(getRedisValue("whois:empty")).resolves.toBe("");

    expect(infoSpy).toHaveBeenCalledWith("Redis cache hit (value length: 0)");
  });

  it("returns null without logging parse errors for empty JSON cache values", async () => {
    redisMock.get.mockResolvedValueOnce("");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    const { getJsonRedisValue } = await importRedisModule();

    await expect(getJsonRedisValue("whois:empty-json")).resolves.toBeNull();

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("skips Redis calls during retry backoff after an outage", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const error = new Error("connection down");
    redisMock.get.mockRejectedValueOnce(error);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const { getRedisValue } = await importRedisModule();

    await expect(getRedisValue("whois:first")).resolves.toBeNull();
    await expect(getRedisValue("whois:second")).resolves.toBeNull();

    expect(redisMock.get).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(30000);
    redisMock.get.mockResolvedValueOnce("cached");

    await expect(getRedisValue("whois:third")).resolves.toBe("cached");

    expect(redisMock.get).toHaveBeenCalledTimes(2);
    expect(infoSpy).toHaveBeenCalledWith("Redis cache connection recovered.");
  });

  it("returns false instead of rethrowing when Redis set fails", async () => {
    const error = new Error("connection down");
    redisMock.set.mockRejectedValueOnce(error);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { setRedisValue } = await importRedisModule();

    await expect(setRedisValue("whois:example.com", "{}")).resolves.toBe(false);

    expect(redisMock.set).toHaveBeenCalledWith(
      "whois:example.com",
      "{}",
      "EX",
      3600,
    );
    expect(warnSpy).toHaveBeenCalledWith(
      "Failed to write to Redis cache; skipping cache: connection down",
    );
  });
});
