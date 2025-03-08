const Redis = require("ioredis");
const { Config } = require("./config");

const publisher = new Redis({
  username: Config.REDIS_USERNAME,
  password: Config.REDIS_PASSWORD,
  host: Config.REDIS_HOST,
  port: Config.REDIS_PORT
})
// const publisher = new Redis(Config.REDIS_SERVICE_URI)

 const publishLog = ({
  log,
  deploymentId,
  type,
  metadata,
  isCompleted,
  hasError
}) => {
  const date = new Date().toISOString();

  const payload = {
    log,
    date,
    deploymentId,
    type,
    metadata,
    isCompleted,
    hasError
  }

  publisher.publish(`logs:${deploymentId}`, JSON.stringify(payload))
}

module.exports = {
  publishLog
}

