import { RunTaskCommand } from "@aws-sdk/client-ecs"
import { Config } from "../../../config/env"
import type { RunProjectPayload } from "../types/project.type"
import { ecsClient } from "../../../utils/aws"
import type { AddProject, DeployProject, EditProject, ListProjects, PatchDeployment, PatchProject, ProjectDetail } from "../schema/project.schema"
import { database } from "../../../db/drizzle"
import { deployments, profiles, projects } from "../../../db/schema"
import { getDeploymentUrl, getRange } from "../../../utils/utils"
import { and, desc, eq, or } from "drizzle-orm"
import { slugify } from "../../../utils/slugify"
import { ForbiddenError, UserInputError } from "../../../utils/error"



const updateProjectDeployment = async (payload: PatchDeployment) => {
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

const deployProject = async (payload: DeployProject) => {

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


  if (!Config.isDebugMode) {

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


    const [deployment] = await
      database
        .insert(deployments)
        .values({
          projectId: project.id,
          status: "Running",
          userId: payload.userId
        }).returning()

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
    //         environment: [
    //           {
    //             name: "AWS_REGION",
    //             value: Config.AWS_REGION
    //           },
    //           {
    //             name: "AWS_ACCESS_KEY",
    //             value: Config.AWS_ACCESS_KEY
    //           },
    //           {
    //             name: "AWS_SECRET_ACCESS_KEY",
    //             value: Config.AWS_SECRET_ACCESS_KEY
    //           },
    //           {
    //             name: "AWS_S3_BUCKET",
    //             value: Config.AWS_S3_BUCKET
    //           },
    //           {
    //             name: "GIT_REPOSITORY_URL",
    //             value: runProjectPayload.gitRepoUrl
    //           },
    //           {
    //             name: "PROJECT_ID",
    //             value: runProjectPayload.projectId
    //           },
    //         ]
    //       }
    //     ]
    //   }
    // })

    // await ecsClient.send(command)

    const deploymentUrl = getDeploymentUrl(runProjectPayload.projectId)

    await updateProjectDeployment({
      id: deployment.id,
      status: "Running",
      userId: payload.userId,
      deploymentUrl,
      completedAt: new Date()
    })

    await patchProject({
      slug: payload.slug,
      userId: payload.userId,
      deploymentUrl
    })
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

  const project = await database
    .insert(projects)
    .values(createPayload)
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

  const project = await database
    .update(projects)
    .set(updatePayload)
    .where(eq(projects.id, String(payload.id)))

  return project
}

const listProjects = async (payload: ListProjects) => {

  await new Promise(resolve => setTimeout(() => resolve(1), 2000))



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

const ProjectService = {
  deployProject,
  createProject,
  updateProject,
  listProjects,
  projectDetail: getProjectDetail
}

export default ProjectService