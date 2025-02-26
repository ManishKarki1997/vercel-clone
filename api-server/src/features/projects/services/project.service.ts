import { RunTaskCommand } from "@aws-sdk/client-ecs"
import { Config } from "../../../config/env"
import type { RunProjectPayload } from "../types/project.type"
import { ecsClient } from "../../../utils/aws"

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

const ProjectService = {
  runProject
}

export default ProjectService