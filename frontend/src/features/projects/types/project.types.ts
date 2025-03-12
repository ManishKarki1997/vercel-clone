import { PROJECT_DETAIL_TABS } from "../constants/project-constants";

export type Project = {
  id: string;
  name: string;
  slug: string;
  gitUrl: string;
  deploymentUrl: string;
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

export type ProjectDetailTabValue = (typeof PROJECT_DETAIL_TABS)[number]["value"];



export type ProjectEnvironmentVariables = Array<{
  name: string;
  value: string;
  projectId: string;
  userId: string;
  id: string;
}>

export type ProjectSettingResponse = {
  environmentVariables: ProjectEnvironmentVariables;
}