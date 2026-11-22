import { Worker } from "bullmq";
import { DEPLOYMENT_QUEUE_NAME } from "@/modules/deployments/queue";
import { processDeploymentJob, DeploymentJobData } from "./processors/deploymentProcessor";
import { ensureStorageDirectories } from "@/lib/storage";

async function runWorker() {
  console.log("------------------------------------------");
  console.log(" SiteNest Deployment Worker Initializing ");
  console.log("------------------------------------------");

  await ensureStorageDirectories();

  const socketPath = process.env.REDIS_SOCKET;
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

  const connection = socketPath && require("fs").existsSync(socketPath)
    ? { path: socketPath }
    : redisUrl.startsWith("redis://")
    ? {
        host: new URL(redisUrl).hostname || "localhost",
        port: Number(new URL(redisUrl).port) || 6379,
      }
    : { host: "localhost", port: 6379 };

  const worker = new Worker<DeploymentJobData>(
    DEPLOYMENT_QUEUE_NAME,
    async (job) => {
      await processDeploymentJob(job);
    },
    {
      connection,
      concurrency: 4,
    }
  );

  worker.on("ready", () => {
    console.log(`[Worker] Connected to Redis queue: ${DEPLOYMENT_QUEUE_NAME}`);
  });

  worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} has completed.`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed with error:`, err.message);
  });

  worker.on("error", (err) => {
    console.error("[Worker] Worker error:", err);
  });

  const shutdown = async () => {
    console.log("[Worker] Shutting down deployment worker...");
    await worker.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

runWorker().catch((err) => {
  console.error("[Worker] Fatal worker startup error:", err);
  process.exit(1);
});
