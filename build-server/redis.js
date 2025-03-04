const Redis = require("ioredis");
const { Config } = require("./config");

// const publisher = new Redis({
//   port: Config.REDIS_PORT,
//   host: Config.REDIS_HOST,
//   username: Config.REDIS_USERNAME,
//   password: Config.REDIS_PASSWORD,
// })
const publisher = new Redis(Config.REDIS_SERVICE_URI)

 const publishLog = ({
  log,
  deploymentId,
  type
}) => {
  const date = new Date().toISOString();
  // console.log("publishing log", {log, deploymentId, date})
  const payload = {
    log,
    date,
    deploymentId,
    type
  }

  publisher.publish(`logs:${deploymentId}`, JSON.stringify(payload))
}

module.exports = {
  publishLog
}

