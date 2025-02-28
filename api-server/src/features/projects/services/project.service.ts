import { RunTaskCommand } from "@aws-sdk/client-ecs"
import { Config } from "../../../config/env"
import type { RunProjectPayload } from "../types/project.type"
import { ecsClient } from "../../../utils/aws"
import type { AddProject, ListProjects } from "../schema/project.schema"
import { database } from "../../../db/drizzle"
import { profiles, projects } from "../../../db/schema"
import { getRange } from "../../../utils/utils"
import { desc, eq } from "drizzle-orm"

const runProject = async (payload: RunProjectPayload) => {


  const command = new RunTaskCommand({
    cluster: Config.AWS_CLUSTER_ARN,
    taskDefinition: Config.AWS_TASK_ARN,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: Config.AWS_TASK_SUBNETS,
        securityGroups: [Config.AWS_TASK_SECURITY_GROUP],
        assignPublicIp: "ENABLED",
      }
    },
    overrides: {
      containerOverrides: [
        {
          name: "builder-image",
          environment: [
            {
              name: "AWS_REGION",
              value: Config.AWS_REGION
            },
            {
              name: "AWS_ACCESS_KEY",
              value: Config.AWS_ACCESS_KEY
            },
            {
              name: "AWS_SECRET_ACCESS_KEY",
              value: Config.AWS_SECRET_ACCESS_KEY
            },
            {
              name: "AWS_S3_BUCKET",
              value: Config.AWS_S3_BUCKET
            },
            {
              name: "GIT_REPOSITORY_URL",
              value: payload.gitRepoUrl
            },
            {
              name: "PROJECT_ID",
              value: payload.projectId
            },
          ]
        }
      ]
    }
  })

  await ecsClient.send(command)

}

const createProject = async (payload: AddProject) => {
  const createPayload = {
    name: payload.name,
    description: payload.description,
    userId: payload.userId!,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const project = await database
    .insert(projects)
    .values(createPayload)
}

const listProjects = async (payload: ListProjects) => {

  await new Promise(resolve => setTimeout(() => resolve(1), 2000))



  const projectList = await database
    .select({
      name: projects.name,
      description: projects.description,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      userId: profiles.id,
      id: projects.id
    })
    .from(projects)
    .leftJoin(profiles, eq(projects.userId, profiles.id))
    .where(
      eq(profiles.id, payload.userId!)
    )
    .limit(+payload.limit)
    .offset(((+payload.page) - 1) * +payload.limit)
    .orderBy(desc(projects.createdAt))

  return {
    projects: projectList,
    page: +payload.page,
    limit: +payload.limit,
    hasNextPage: projectList.length >= +payload.limit
  }
}

const ProjectService = {
  runProject,
  createProject,
  listProjects
}

export default ProjectService