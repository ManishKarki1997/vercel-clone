import { desc, eq } from "drizzle-orm"
import { database } from "../../../db/drizzle"
import { deployments, profiles, projects } from "../../../db/schema"
import type { Dashboard } from "../schema/app.schema"

const dashboard = async (payload: Dashboard) => {
  const projectList = await database
    .select({
      name: projects.name,
      status: projects.status,
      userId: profiles.id,
      id: projects.id,
      createdAt: projects.createdAt,
      deploymentUrl: projects.deploymentUrl
    })
    .from(projects)
    .leftJoin(profiles, eq(projects.userId, profiles.id))
    .where(
      eq(profiles.id, payload.userId!)
    )
    .limit(+payload.limit)
    .offset(((+payload.page) - 1) * +payload.limit)
    .orderBy(desc(projects.createdAt))


  const deploymentsList = await database
    .select({
      status: deployments.status,
      deploymentUrl: deployments.deploymentUrl,
      id: deployments.id,
      createdAt: projects.createdAt,
      projectName: projects.name
    })
    .from(deployments)
    .leftJoin(projects, eq(projects.id, deployments.projectId))
    .leftJoin(profiles, eq(projects.userId, profiles.id))
    .where(
      eq(profiles.id, payload.userId!)
    )
    .limit(+payload.limit)
    .offset(((+payload.page) - 1) * +payload.limit)
    .orderBy(desc(deployments.createdAt))


  return {
    projects: projectList,
    deployments: deploymentsList
  }

}

const AppService = {
  dashboard
}

export default AppService