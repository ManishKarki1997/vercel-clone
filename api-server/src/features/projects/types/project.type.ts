export type RunProjectPayload = {
  slug: string;
  userId: string;
}


export type ProjectDeploymentMetadata = {
  projectId: string;
  deploymentId: string;
  userId: string;
  deploymentUrl: string;
  projectSlug: string;
  error?: boolean;
}

export type TriggerLocalBuildPayload = {
  projectId: string;
  userId: string;
  environmentVariables: Array<{
    name: string;
    value: string;
  }>
}

export type SaveDeploymentLogPayload = ProjectDeploymentMetadata & {
  log: string;
  type: string;
  date: string;
  deploymentId: string;
}