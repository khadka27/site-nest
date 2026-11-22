import { Job } from "bullmq";
import { executeDeployment } from "@/modules/deployments/deploymentService";

export interface DeploymentJobData {
  deploymentId: string;
}

export async function processDeploymentJob(job: Job<DeploymentJobData>): Promise<void> {
  const { deploymentId } = job.data;
  console.log(`[Worker] Starting job ${job.id} for deployment: ${deploymentId}`);

  const result = await executeDeployment(deploymentId);

  if (!result.success) {
    throw new Error(result.error || "Deployment execution failed in worker");
  }

  console.log(`[Worker] Successfully completed deployment: ${deploymentId}`);
}
