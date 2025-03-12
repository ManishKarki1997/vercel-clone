import { exec, spawn, spawnSync } from 'child_process'
import path from 'path'
import fs from "fs"
import { fileURLToPath } from 'url';
import type { TriggerLocalBuildPayload } from "../types/project.type";
import { Config } from "../../../config/env";
import EventEmitter from 'events';

export class LocalProjectDeployService extends EventEmitter {

  private __filename;
  private BUILD_SERVER_PATH;

  constructor() {
    super()
    this.__filename = fileURLToPath(import.meta.url);

    this.BUILD_SERVER_PATH = path.join(path.dirname(this.__filename), "../../../../../build-server")

  }

  async makeProjectEnv(payload: { envsFolderLocation: string; envContent: string, projectEnvPath: string }) {
    if (!fs.existsSync(payload.envsFolderLocation)) {
      fs.mkdirSync(payload.envsFolderLocation, { recursive: true })
    }

    fs.writeFileSync(payload.projectEnvPath, payload.envContent);
  }

  async stopDocker(dockerPath: string) {
    console.log('Stopping docker at ', dockerPath)
    spawnSync("docker", ["compose", "down", "--volumes"], { cwd: dockerPath, stdio: "inherit" });
  };

  async triggerLocalBuild(payload: TriggerLocalBuildPayload) {
    try {
      const envContent = payload.environmentVariables.map(({ name, value }) => `${name}=${value}`).join("\n");
      const envsFolderLocation = path.join(`${this.BUILD_SERVER_PATH}/envs`)
      const projectEnvPath = `${envsFolderLocation}/${payload.projectId}.env`

      await this.makeProjectEnv({ envsFolderLocation, envContent, projectEnvPath })

      if (Config.NODE_ENV === "development") {
        this.stopDocker(this.BUILD_SERVER_PATH);
      }



      // Spawn a new process to run docker compose up with the env file
      const dockerProcess = spawn("docker", ["compose", "up", "--build", "-d"], {
        env: {
          PROJECT_ID: payload.projectId
        },
        cwd: this.BUILD_SERVER_PATH, // Change working directory to the project folder
        stdio: "inherit", // Pipe output to console
      });




      // const command = ` cd "${BUILD_SERVER_PATH}" && docker compose up --build} `
      // console.log("dirname", path.dirname(__filename), BUILD_SERVER_PATH, command)
      // const process = exec(command);

      // dockerProcess.on("data", (data) => console.log(data.toString()));
      dockerProcess.on("error", (err) => {
        this.emit("error", err)
      });

      dockerProcess.on("exit", (code) => {
        if (code === 1) {
          this.emit("error", new Error("Something went wrong"))
        } else {
          this.emit("exit", code)
        }
        console.log(`Process exited with code ${code}`);
      });

    } catch (error) {
      this.stopDocker(this.BUILD_SERVER_PATH);
      this.emit("error", error)
    }


  }
}