import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs"
import { Config } from "../config/env"

const ecsClient = new ECSClient({
  region: Config.AWS_REGION,
  credentials: {
    accessKeyId: Config.AWS_ACCESS_KEY,
    secretAccessKey: Config.AWS_SECRET_ACCESS_KEY
  }
})

export {
  ecsClient
}