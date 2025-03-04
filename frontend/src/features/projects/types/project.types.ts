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