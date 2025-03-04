const Redis = require("ioredis");
const { Config } = require("./config/config");

const publisher = new Redis({
  port: Config.REDIS_PORT,
  host: Config.REDIS_HOST,
  username: Config.REDIS_USERNAME,
  password: Config.REDIS_PASSWORD,
})

 const publishLog = ({
  log,
  deploymentId
}) => {
  const date = new Date().toISOString();
  // console.log("publishing log", {log, deploymentId, date})
  const payload = {
    log,
    date,
    deploymentId
  }

  publisher.publish(`logs:${deploymentId}`, JSON.stringify(payload))
}

module.exports = {
  publishLog
}

