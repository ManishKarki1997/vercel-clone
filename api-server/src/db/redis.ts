import Redis from 'ioredis'
import { Config } from '../config/env'
import { sendDeploymentEvent } from './socket'

const subscriber = new Redis({
  port: Config.REDIS_PORT,
  host: Config.REDIS_HOST,
  username: Config.REDIS_USERNAME,
  password: Config.REDIS_PASSWORD,
})

export const initSubscribeToLogs = () => {
  subscriber.psubscribe(`logs*`)
  subscriber.on(`pmessage`, (pattern, channel, message) => {
    const deploymentId = channel.split(":")[1]
    // console.log(`Received log `, { message, deploymentId })
    sendDeploymentEvent({ channelId: channel, log: message })
  })
}

