import dotenv from 'dotenv'

dotenv.config();

export const Config = {
  isDebugMode: false,
  PORT: process.env.PORT || 3000,
  SOCKET_SERVER_PORT: process.env.SOCKET_SERVER_PORT ? Number(process.env.SOCKET_SERVER_PORT) : 3002,
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URLS: process.env.FRONTEND_URLS!.split(","),
  PROXY_SERVER: process.env.PROXY_SERVER || `localhost:3001`,
  AWS_REGION: process.env.AWS_REGION!,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET!,
  AWS_CLUSTER_ARN: process.env.AWS_CLUSTER_ARN!,
  AWS_TASK_ARN: process.env.AWS_TASK_ARN!,
  AWS_TASK_SUBNETS: process.env.AWS_TASK_SUBNETS!.split(","),
  AWS_TASK_SECURITY_GROUP: process.env.AWS_TASK_SECURITY_GROUP!,
  SUPABASE_DB_PASSWORD: process.env.SUPABASE_DB_PASSWORD!,
  SUPABASE_PROJECT_URL: process.env.SUPABASE_PROJECT_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET!,
  SUPABASE_ACCESS_TOKEN_EXPIRY_SECONDS: process.env.SUPABASE_ACCESS_TOKEN_EXPIRY_SECONDS ? Number(process.env.SUPABASE_ACCESS_TOKEN_EXPIRY_SECONDS) : 3600,
  COOKIE_NAME: process.env.COOKIE_NAME || "vercel-app",
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_PORT: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_USERNAME: process.env.REDIS_USERNAME || "",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",

}