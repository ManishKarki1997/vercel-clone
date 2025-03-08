import Redis from 'ioredis'
import { Config } from '../config/env'
import { sendDeploymentEvent } from './socket'
import type { ProjectDeploymentMetadata } from '../features/projects/types/project.type'
import ProjectService from '../features/projects/services/project.service'

// const subscriber = new Redis({
//   port: Config.REDIS_PORT,
//   host: Config.REDIS_HOST,
//   username: Config.REDIS_USERNAME,
//   password: Config.REDIS_PASSWORD,
// })

const redisConfig = {
  username: Config.REDIS_USERNAME,
  password: Config.REDIS_PASSWORD,
  host: Config.REDIS_HOST,
  port: Config.REDIS_PORT
}

const subscriber = new Redis(redisConfig)

export const redis = new Redis(redisConfig)

export const initSubscribeToLogs = () => {
  subscriber.psubscribe(`logs*`)
  subscriber.on(`pmessage`, async (pattern, channel, message) => {
    const deploymentId = channel.split(":")[1]
    const parsedLog = JSON.parse(message)
    // console.log(`Received log `, parsedLog)
    await redis.rpush(`deployment_logs:${deploymentId}`, message);

    if (parsedLog?.isCompleted) {
      // cleanup stuff
      const metadata = parsedLog.metadata as ProjectDeploymentMetadata
      await ProjectService.handleProjectDeployed({ ...metadata, error: parsedLog?.hasError })
      await ProjectService.saveDeploymentLogs(deploymentId)
      await redis.del(`deployment_logs:${deploymentId}`);
    }
    sendDeploymentEvent({ channelId: channel, log: message })

  })
}

