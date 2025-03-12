import { Config } from "../config/env";

export function getRange(page: number = 1, limit: number = 10) {
  const from = page * limit;
  const to = from + limit - 1;

  return [from, to];
}

export const getDeploymentUrl = (slug: string) => {
  const isDevelopment = Config.NODE_ENV === "development"

  const protocol = isDevelopment ? "http" : "https"
  const host = Config.PROXY_SERVER
  const url = `${protocol}://${slug}.${host}`
  return url

}

export const encodeObjectToEnvVariable = (object: Record<string, string>) => {
  const stringified = Object.entries(object)
    .map(([key, value]) => `${key}==${value}`)
    .join(',');
  console.log("stringified metadata", stringified)
  return stringified
}