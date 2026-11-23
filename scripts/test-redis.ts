import redis from "../src/lib/redis";

async function testRedis() {
  console.log("Connecting to Redis...");
  await redis.set("test", "Hello Redis");
  const value = await redis.get("test");
  console.log("Retrieved value from Redis:", value);

  if (value === "Hello Redis") {
    console.log("✓ Redis connection test passed successfully!");
  } else {
    throw new Error(`Unexpected value: ${value}`);
  }

  await redis.quit();
}

testRedis().catch((err) => {
  console.error("Redis test failed:", err);
  process.exit(1);
});
