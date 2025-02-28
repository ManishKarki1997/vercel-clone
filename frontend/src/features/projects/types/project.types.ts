export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}


export type ProjectPage = {
  limit: number;
  page: number;
  hasNextPage: boolean;
  projects: Project[];
}