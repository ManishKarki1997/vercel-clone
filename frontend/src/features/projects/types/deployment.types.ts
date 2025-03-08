export type DeploymentLog = {
  log: string;
  timestamp?: string;
  date?: string;
  deploymentId: string;
  type?: string;
  isCompleted?: boolean,
  hasError?: boolean
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
  userId: string;
  status: "Started" | "Running" | "Completed" | "Failed";
}