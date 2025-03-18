import { RunTaskCommand } from "@aws-sdk/client-ecs"
import { Config } from "../../../config/env"
import type { ProjectDeploymentMetadata, RunProjectPayload, SaveDeploymentLogPayload } from "../types/project.type"
import { ecsClient } from "../../../utils/aws"
import type { AddProject, DeleteDeployment, DeployProject, EditProject, ListDeploymentLogs, ListProjectDeployments, ListProjects, ListProjectSettings, PatchDeployment, PatchProject, ProjectDetail, ProjectSetting } from "../schema/project.schema"
import { database } from "../../../db/drizzle"
import { deploymentLogs, deployments, profiles, projectEnvVariables, projects } from "../../../db/schema"
import { encodeObjectToEnvVariable, getDeploymentUrl, getRange } from "../../../utils/utils"
import { and, count, desc, eq, inArray, or } from "drizzle-orm"
import { slugify } from "../../../utils/slugify"
import { ForbiddenError, NotFoundError, UserInputError } from "../../../utils/error"
import { DEFAULT_PROJECT_SETTINGS } from "../constants/project-constants"
import { buildDrizzleConflictUpdateColumns } from "../../../utils/database"
import { triggerLocalBuild } from "../utils/trigger-deploy"
import { sendDeploymentEvent } from "../../../db/socket"
import { redis } from "../../../db/redis"
import { LocalProjectDeployService } from "./local-deploy-service"

const getRequiredDeploymentEnvVariables = () => {
  return [
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
      name: "REDIS_PORT",
      value: String(Config.REDIS_PORT)
    },
    {
      name: "REDIS_USERNAME",
      value: Config.REDIS_USERNAME
    },
    {
      name: "REDIS_PASSWORD",
      value: Config.REDIS_PASSWORD
    },
    {
      name: "REDIS_HOST",
      value: Config.REDIS_HOST
    },
  ]
}

const getProjectIdBySlug = async (slug: string) => {

  const redisProjectId = await redis.get(Config.PROJECT_SLUG_TO_ID_CACHE_KEY(slug))

  if (redisProjectId) {
    return redisProjectId
  }

  const [project] = await
    database
      .select({
        id: projects.id,
        slug: projects.slug
      })
      .from(projects)
      .where(eq(projects.slug, slug))

  if (project?.id) {
    await redis.set(Config.PROJECT_SLUG_TO_ID_CACHE_KEY(slug), project.id)
  }

  return project?.id
}

const checkProjectBelongsToUser = async (payload: {
  userId: string;
  projectId?: string;
  projectSlug?: string;
}) => {

  if (!payload.projectId && !payload.projectSlug) {
    throw new Error("Project id or slug is required")
  }

  const wherClause = payload.projectId ? eq(projects.id, payload.projectId) : eq(projects.slug, payload.projectSlug)

  const [project] = await
    database
      .select({
        id: projects.id,
        name: projects.name,
        slug: projects.slug,
        gitUrl: projects.gitUrl,
        description: projects.description,
        status: projects.status,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        userId: projects.userId
      })
      .from(projects)
      .where(
        wherClause
      )

  if (!project) {
    throw new UserInputError("Project does not exist")
  }

  if (project.userId !== payload.userId) {
    throw new ForbiddenError("You do not own this project")
  }

  return project
}



const upsertDefaultProjectEnvVariables = async (payload: { projectId: string, userId: string }) => {
  const envVariables = DEFAULT_PROJECT_SETTINGS.map(env => ({
    ...env,
    projectId: payload.projectId,
    userId: payload.userId
  }))

  await database
    .insert(projectEnvVariables)
    .values(envVariables)
    .onConflictDoNothing()
}

const updateProjectDeployment = async (payload: PatchDeployment) => {
  if (Object.keys(payload).length === 0) return

  await
    database
      .update(deployments)
      .set(payload)
      .where(
        and(
          eq(deployments.id, payload.id),
          eq(deployments.userId, payload.userId)
        )
      )
}


const patchProject = async (payload: PatchProject) => {
  if (Object.keys(payload).length === 0) return

  await
    database
      .update(projects)
      .set(payload)
      .where(
        and(
          eq(projects.slug, payload.slug),
          eq(projects.userId, payload.userId)
        )
      )
}

const handleProjectDeployed = async (payload: ProjectDeploymentMetadata) => {
  // console.log("handleProjectDeployed", payload)
  await patchProject({
    id: payload.projectId,
    userId: payload.userId,
    deploymentUrl: payload.deploymentUrl,
    slug: payload.projectSlug,
  })

  await updateProjectDeployment({
    id: payload.deploymentId,
    status: payload.error ? "Failed" : "Completed",
    userId: payload.userId,
    completedAt: payload.error ? undefined : new Date(),
  })
}

const deployProject = async (payload: DeployProject) => {
  try {


    // create deployment
    const project = await
      getProjectDetail({ slug: payload.slug })


    if (!project) {
      throw new UserInputError("Project does not exist")
    }

    if (project.userId !== payload.userId) {
      throw new ForbiddenError("You do not own this project")
    }

    if (project.status !== "Active") {
      throw new ForbiddenError("Project is not active. Please activate the project first")
    }


    const settings = await ProjectService.listSettings({
      projectId: project.id,
      userId: payload.userId
    })

    const envVariables = settings.environmentVariables.map(env => ({ name: env.name, value: env.value }))

    for (const envVariable of DEFAULT_PROJECT_SETTINGS) {
      if (!envVariables.find(env => env.name === envVariable.name)) {
        envVariables.push(envVariable)
      }
    }



    envVariables.push({
      name: "GIT_REPOSITORY_URL",
      value: project.gitUrl
    })

    envVariables.push({
      name: "PROJECT_ID",
      value: project.id
    })

    envVariables.push({
      name: "PROJECT_SLUG",
      value: project.slug
    })




    const existingDeployment = await
      database
        .select({})
        .from(deployments)
        .where(
          and(
            eq(deployments.projectId, project.id),
            or(eq(deployments.status, "Running"), eq(deployments.status, "Started"))
          )
        )

    if (existingDeployment.length > 0) {
      throw new ForbiddenError("Please cancel the previous deployment before redeploying")
    }




    // console.log("containerOverridesEnvs", containerOverridesEnvs)
    // return;

    const [deployment] = await
      database
        .insert(deployments)
        .values({
          projectId: project.id,
          status: "Running",
          userId: payload.userId,
          deploymentUrl: getDeploymentUrl(project.slug)
        }).returning()

    envVariables.push({
      name: "PROJECT_METADATA",
      value: encodeObjectToEnvVariable({
        projectId: project.id,
        projectSlug: project.slug,
        deploymentId: deployment.id,
        userId: payload.userId,
        deploymentUrl: deployment.deploymentUrl || ""
      })
    })

    const containerOverridesEnvs = [...getRequiredDeploymentEnvVariables(), ...envVariables]
    // console.log("containerOverridesEnvs", containerOverridesEnvs)


    const runProjectPayload = {
      gitRepoUrl: project.gitUrl,
      projectId: project.slug
    }



    // const command = new RunTaskCommand({
    //   cluster: Config.AWS_CLUSTER_ARN,
    //   taskDefinition: Config.AWS_TASK_ARN,
    //   launchType: "FARGATE",
    //   count: 1,
    //   networkConfiguration: {
    //     awsvpcConfiguration: {
    //       subnets: Config.AWS_TASK_SUBNETS,
    //       securityGroups: [Config.AWS_TASK_SECURITY_GROUP],
    //       assignPublicIp: "ENABLED",
    //     }
    //   },
    //   overrides: {
    //     containerOverrides: [
    //       {
    //         name: "builder-image",
    //         environment: containerOverridesEnvs
    //       }
    //     ]
    //   }
    // })

    // await ecsClient.send(command)

    const deploymentUrl = deployment.deploymentUrl!

    await updateProjectDeployment({
      id: deployment.id,
      status: "Running",
      userId: payload.userId,
      deploymentUrl,
    })

    const localDeployService = new LocalProjectDeployService();

    localDeployService.triggerLocalBuild({
      userId: payload.userId,
      projectId: project.id,
      environmentVariables: containerOverridesEnvs
    })

    localDeployService.on("exit", async () => {
      await patchProject({
        slug: payload.slug,
        userId: payload.userId,
        deploymentUrl
      })
    })

    localDeployService.on("error", async (error) => {
      console.error("error deploying project", error)
      await updateProjectDeployment({
        id: deployment.id,
        status: "Failed",
        userId: payload.userId,
        deploymentUrl,
      })
    })




    return deployment

  } catch (error) {
    console.error("Error deploying project", error)
  }
}

const createProject = async (payload: AddProject) => {

  let slug = slugify(payload.name, true)

  const existingProjectsWithSlug = await database
    .select({ name: projects.name })
    .from(projects)
    .where(eq(projects.slug, slug))

  while (existingProjectsWithSlug.length > 0) {
    slug = slugify(payload.name, true)
  }

  const createPayload = {
    name: payload.name,
    description: payload.description,
    userId: payload.userId!,
    slug,
    gitUrl: payload.gitUrl,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const [project] = await database
    .insert(projects)
    .values(createPayload)
    .returning()

  await upsertDefaultProjectEnvVariables({ projectId: project.id, userId: payload.userId! })
}

const updateProject = async (payload: EditProject) => {


  const existingProjectsWithSlug = await database
    .select({ name: projects.name, id: projects.id, slug: projects.slug })
    .from(projects)
    .where(eq(projects.slug, payload.slug))


  if (existingProjectsWithSlug.length > 0 && (existingProjectsWithSlug[0].id) !== (payload.id)) {
    throw new UserInputError("Project with this slug already exists")
  }

  const updatePayload = {
    name: payload.name,
    description: payload.description,
    userId: payload.userId!,
    slug: payload.slug,
    gitUrl: payload.gitUrl,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  if (payload?.slug) {
    await redis.set(Config.PROJECT_SLUG_TO_ID_CACHE_KEY(payload.slug), String(payload.id))
  }

  const project = await database
    .update(projects)
    .set(updatePayload)
    .where(eq(projects.id, String(payload.id)))

  await upsertDefaultProjectEnvVariables({ projectId: payload.id, userId: payload.userId! })


  return project
}

const listProjects = async (payload: ListProjects) => {

  const projectList = await database
    .select({
      name: projects.name,
      slug: projects.slug,
      description: projects.description,
      status: projects.status,
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

const getProjectDetail = async (payload: ProjectDetail) => {
  const project = await
    database
      .select({
        id: projects.id,
        name: projects.name,
        slug: projects.slug,
        gitUrl: projects.gitUrl,
        deploymentUrl: projects.deploymentUrl,
        description: projects.description,
        status: projects.status,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        userId: projects.userId
      })
      .from(projects)
      .where(eq(projects.slug, payload.slug))

  return project[0]
}



const listProjectDeployments = async (payload: ListProjectDeployments) => {
  const totalDeployments = await database
    .select({ count: count() })
    .from(deployments)
    .leftJoin(profiles, eq(deployments.userId, profiles.id))
    .where(
      and(
        eq(profiles.id, payload.userId!),
        eq(deployments.projectId, payload.projectId),
      )
    )



  const deploymentsList = await database
    .select({
      name: projects.name,
      userId: profiles.id,
      id: deployments.id,
      projectId: deployments.projectId,
      deploymentUrl: deployments.deploymentUrl,
      createdAt: deployments.createdAt,
      completedAt: deployments.completedAt,
      status: deployments.status,
      commitHash: deployments.commitHash,
      commitMessage: deployments.commitMessage,
    })
    .from(deployments)
    .leftJoin(projects, eq(projects.id, deployments.projectId))
    .leftJoin(profiles, eq(deployments.userId, profiles.id))
    .where(
      and(
        eq(profiles.id, payload.userId!),
        eq(deployments.projectId, payload.projectId),
      )
    )
    .limit(+payload.limit)
    .offset(((+payload.page) - 1) * +payload.limit)
    .orderBy(desc(deployments.createdAt))

  return {
    total: totalDeployments[0].count,
    totalPages: Math.ceil(Number(totalDeployments[0].count) / +payload.limit),
    deployments: deploymentsList,
    page: +payload.page,
    limit: +payload.limit,
    hasNextPage: deploymentsList.length >= +payload.limit
  }
}

const updateSettings = async (payload: ProjectSetting) => {
  const { environmentVariables } = payload

  const project = await checkProjectBelongsToUser({ userId: payload.userId, projectId: payload.projectId })

  if (!project) {
    throw new NotFoundError("Project not found")
  }

  const envVariables = [...environmentVariables].map(env => ({
    ...env,
    projectId: payload.projectId,
    userId: payload.userId
  }))

  // ensuring the default variables are present
  DEFAULT_PROJECT_SETTINGS.forEach(setting => {
    if (!envVariables.find(env => env.name === setting.name)) {
      envVariables.push({
        ...setting,
        projectId: payload.projectId,
        userId: payload.userId
      })
    }
  })

  const existingProjectEnvVariables = await
    database
      .select({ name: projectEnvVariables.name, value: projectEnvVariables.value, id: projectEnvVariables.id })
      .from(projectEnvVariables)
      .where(
        and(
          eq(projectEnvVariables.projectId, payload.projectId),
          eq(projectEnvVariables.userId, payload.userId)
        )
      )

  const deletedEnvVariableNames =
    existingProjectEnvVariables
      .map(env => env.name)
      .filter(name => !envVariables.map(e => e.name).includes(name))


  if (deletedEnvVariableNames.length > 0) {

    await database
      .delete(projectEnvVariables)
      .where(
        and(
          eq(projectEnvVariables.projectId, payload.projectId),
          eq(projectEnvVariables.userId, payload.userId),
          inArray(projectEnvVariables.name, deletedEnvVariableNames),
        )
      )
  }

  await database
    .insert(projectEnvVariables)
    .values(envVariables)
    .onConflictDoUpdate({
      target: [projectEnvVariables.projectId, projectEnvVariables.name],
      set: buildDrizzleConflictUpdateColumns(projectEnvVariables, ['name', 'value'])
    })

}

const listSettings = async (payload: ListProjectSettings) => {
  const environmentVariables =
    await database
      .select({
        name: projectEnvVariables.name,
        value: projectEnvVariables.value,
        id: projectEnvVariables.id,
        userId: projectEnvVariables.userId,
        projectId: projectEnvVariables.projectId,
      })
      .from(projectEnvVariables)
      .where(
        and(
          eq(projectEnvVariables.projectId, payload.projectId),
          eq(projectEnvVariables.userId, payload.userId)
        )
      )

  return {
    environmentVariables
  }
}

const saveDeploymentLogs = async (deploymentId: string) => {
  // console.log("to save logs ", payload)
  try {
    const redisDeploymentLogs = await redis.lrange(`deployment_logs:${deploymentId}`, 0, -1)

    if (!redisDeploymentLogs?.length) return;
    const parsedLogs: SaveDeploymentLogPayload[] = redisDeploymentLogs
      .map(log => JSON.parse(log))
      .map(log => ({
        ...log,
        ...(log.metadata || {})
      }))
    // console.log("parsedLogs", parsedLogs)
    const insertPayload = parsedLogs.map(log => ({
      log: log.log,
      timestamp: log.date ? new Date(log.date) : new Date(),
      deploymentId: log.deploymentId,
      type: log.type,
      userId: log.userId,
      projectId: log.projectId,
    }))

    // console.log('deploymentLogs', redisDeploymentLogs)
    await database
      .insert(deploymentLogs)
      .values(insertPayload)
  } catch (error) {
    console.error("Error saving deployment logs", error)
  }
}

const listDeploymentLogs = async (payload: ListDeploymentLogs) => {
  const logs =
    await database
      .select({
        log: deploymentLogs.log,
        timestamp: deploymentLogs.timestamp,
      })
      .from(deploymentLogs)
      .where(
        and(
          eq(deploymentLogs.userId, payload.userId),
          eq(deploymentLogs.deploymentId, payload.deploymentId),
        )
      )

  return logs
}

const deleteDeployment = async (payload: DeleteDeployment) => {
  await
    database
      .delete(deployments)
      .where(
        and(
          eq(deployments.id, payload.deploymentId),
          eq(deployments.userId, payload.userId)
        )
      )
}

const ProjectService = {
  deployProject,
  createProject,
  updateProject,
  listProjects,
  projectDetail: getProjectDetail,
  listProjectDeployments,
  updateSettings,
  listSettings,
  handleProjectDeployed,
  saveDeploymentLogs,
  listDeploymentLogs,
  deleteDeployment,
  getProjectIdBySlug
}

export default ProjectService