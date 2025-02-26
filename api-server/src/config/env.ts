import dotenv from 'dotenv'

dotenv.config();

export const Config = {
  PORT: process.env.PORT || 3000,
  PROXY_SERVER: process.env.PROXY_SERVER || `http://localhost:3001`,
  AWS_REGION: process.env.AWS_REGION!,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET!,
  AWS_CLUSTER_ARN: process.env.AWS_CLUSTER_ARN!,
  AWS_TASK_ARN: process.env.AWS_TASK_ARN!,
  AWS_TASK_SUBNETS: process.env.AWS_TASK_SUBNETS!.split(","),
  AWS_TASK_SECURITY_GROUP: process.env.AWS_TASK_SECURITY_GROUP!,
}