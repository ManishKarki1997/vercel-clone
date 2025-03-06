import { exec, spawn } from 'child_process'
import path from 'path'
import fs from "fs"
import { fileURLToPath } from 'url';
import type { TriggerLocalBuildPayload } from '../types/project.type'

const __filename = fileURLToPath(import.meta.url);

const BUILD_SERVER_PATH = path.join(path.dirname(__filename), "../../../../../build-server")


const makeProjectEnv = async (payload: { envsFolderLocation: string; envContent: string, projectEnvPath: string }) => {
  if (!fs.existsSync(payload.envsFolderLocation)) {
    fs.mkdirSync(payload.envsFolderLocation, { recursive: true })
  }

  fs.writeFileSync(payload.projectEnvPath, payload.envContent);
  console.log("envContent", payload.envContent)
}

export const triggerLocalBuild = async (payload: TriggerLocalBuildPayload) => {

  // return
  const envContent = payload.environmentVariables.map(({ name, value }) => `${name}=${value}`).join("\n");
  const envsFolderLocation = path.join(`${BUILD_SERVER_PATH}/envs`)
  const projectEnvPath = `${envsFolderLocation}/${payload.projectId}.env`

  await makeProjectEnv({ envsFolderLocation, envContent, projectEnvPath })

  // Spawn a new process to run docker compose up with the env file
  const dockerProcess = spawn("docker", ["compose", "up", "--build", "-d"], {
    env: {
      PROJECT_ID: payload.projectId
    },
    cwd: BUILD_SERVER_PATH, // Change working directory to the project folder
    stdio: "inherit", // Pipe output to console
  });

  // const command = ` cd "${BUILD_SERVER_PATH}" && docker compose up --build} `
  // console.log("dirname", path.dirname(__filename), BUILD_SERVER_PATH, command)
  // const process = exec(command);

  dockerProcess.on("data", (data) => console.log(data.toString()));
  dockerProcess.on("error", (err) => console.log(err.toString()));

  dockerProcess.on("exit", (code) => {
    console.log(`Process exited with code ${code}`);
  });

}
