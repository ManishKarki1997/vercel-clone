export type Project = {
  id: string;
  name: string;
  slug: string;
  gitUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: "Active" | "Archived"
}


export type ProjectPage = {
  limit: number;
  page: number;
  hasNextPage: boolean;
  projects: Project[];
}

export type Deployment = {
  id: string;
  projectId: string;
  status: "Started" | "Running" | "Completed" | "Failed";
  createdAt: string;
  completedAt?: string;
  userId: string;
  deploymentUrl: string;
  commitHash?: string;
  commitMessage?: string;
}