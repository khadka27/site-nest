import { Queue, Worker, Job } from "bullmq";
import { executeDeployment } from "./deploymentService";

export const DEPLOYMENT_QUEUE_NAME = "sitenest-deployments";

let deploymentQueue: Queue | null = null;

export function getDeploymentQueue(): Queue | null {
  if (deploymentQueue) return deploymentQueue;

  try {
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

    deploymentQueue = new Queue(DEPLOYMENT_QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        attempts: 2,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    });

    return deploymentQueue;
  } catch (err) {
    console.warn("Failed to initialize BullMQ Queue, will use direct execution:", err);
    return null;
  }
}

/**
 * Dispatches a deployment. If BullMQ queue is active, enqueues the job;
 * otherwise executes directly via background promise.
 */
export async function queueDeployment(deploymentId: string): Promise<{ queued: boolean; mode: "queue" | "sync" }> {
  const queue = getDeploymentQueue();

  if (queue) {
    try {
      await queue.add("deploy", { deploymentId }, { jobId: `deploy-${deploymentId}` });
      return { queued: true, mode: "queue" };
    } catch (err) {
      console.warn("Queue dispatch error, falling back to direct background execution:", err);
    }
  }

  // Fallback: run async without blocking the HTTP request
  setImmediate(async () => {
    try {
      await executeDeployment(deploymentId);
    } catch (err) {
      console.error("Direct deployment failed:", err);
    }
  });

  return { queued: true, mode: "sync" };
}
