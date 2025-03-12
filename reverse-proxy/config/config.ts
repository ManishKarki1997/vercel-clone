import dotenv from 'dotenv'

dotenv.config();


export const Config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 9001,
  AWS_BUCKET_PATH: process.env.AWS_BUCKET_PATH,
  API_SERVER_URL: process.env.API_SERVER_URL,
}