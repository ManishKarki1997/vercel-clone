const dotenv = require('dotenv')

dotenv.config();

const Config = {
  isDebugMode: true, 
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  PROJECT_ID: process.env.PROJECT_ID,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

  REDIS_PORT: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_USERNAME: process.env.REDIS_USERNAME || "",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
  REDIS_SERVICE_URI: process.env.REDIS_SERVICE_URI || "",
}

module.exports = {Config}