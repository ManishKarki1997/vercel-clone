export type DeploymentLog = {
  log: string;
  date: string;
  deploymentId: string;
}

export type Deployment = {
  commitHash: string | null;
  commitMessage: string | null;
  createdAt: string;
  completedAt: string;
  deploymentUrl: string;
  id: string;
  name: string;
  projectId: string;
  status: "Started" | "Running" | "Completed" | "Failed";
}