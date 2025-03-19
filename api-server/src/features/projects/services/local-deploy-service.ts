import { exec, spawn, spawnSync } from 'child_process'
import path from 'path'
import fs from "fs"
import { fileURLToPath } from 'url';
import type { TriggerLocalBuildPayload } from "../types/project.type";
import { Config } from "../../../config/env";
import EventEmitter from 'events';
import { publisher } from '../../../db/redis';

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

  async stopDocker({ dockerPath, projectId }: { dockerPath: string, projectId: string }) {
    spawnSync("docker", ["compose", "down", "--volumes"],
      {
        cwd: dockerPath,
        stdio: "inherit",
        env: {
          PROJECT_ID: projectId,
          COMPOSE_PROJECT_NAME: projectId,
        },
      }
    );
  };

  async triggerLocalBuild(payload: TriggerLocalBuildPayload) {
    try {
      const envContent = [...payload.environmentVariables, { name: 'VITE_BASE_URL', value: `__outputs/${payload.projectId}` }].map(({ name, value }) => `${name}=${value}`).join("\n");
      const envsFolderLocation = path.join(`${this.BUILD_SERVER_PATH}/envs`)
      const projectEnvPath = `${envsFolderLocation}/${payload.projectId}.env`

      await this.makeProjectEnv({ envsFolderLocation, envContent, projectEnvPath })

      if (Config.NODE_ENV === "development") {
        this.stopDocker({ dockerPath: this.BUILD_SERVER_PATH, projectId: payload.projectId });
      }

      const date = new Date().toISOString();

      const initialPayload = {
        log: "",
        date,
        projectId: payload.projectId,
        type: "info",
        isCompleted: false,
        hasError: false,
      }

      initialPayload.log = "Spinning up docker container to build the project"
      publisher.publish(`logs:${initialPayload.projectId}`, JSON.stringify(initialPayload))
      initialPayload.log = ""


      // Spawn a new process to run docker compose up with the env file
      const dockerProcess = spawn("docker", ["compose", "up", "--build", "-d"], {
        env: {
          PROJECT_ID: payload.projectId,
          COMPOSE_PROJECT_NAME: payload.projectId,
        },
        cwd: this.BUILD_SERVER_PATH, // Change working directory to the project folder
        stdio: "inherit", // Pipe output to console
      });


      dockerProcess.on("data", (data) => {
        initialPayload.log = data.toString()
        publisher.publish(`logs:${initialPayload.projectId}`, JSON.stringify(initialPayload))
      });

      dockerProcess.on("error", (err) => {
        initialPayload.log = err.toString()
        initialPayload.isCompleted = true
        initialPayload.hasError = true
        publisher.publish(`logs:${initialPayload.projectId}`, JSON.stringify(initialPayload))
        this.emit("error", err)
      });

      dockerProcess.on("exit", (code) => {
        if (code === 1) {
          initialPayload.log = "Something went wrong"
          initialPayload.isCompleted = true
          initialPayload.hasError = true
          publisher.publish(`logs:${initialPayload.projectId}`, JSON.stringify(initialPayload))
          this.emit("error", new Error("Something went wrong"))
        } else {
          initialPayload.log = "Finished spinning up docker container"
          initialPayload.isCompleted = false
          initialPayload.hasError = false
          publisher.publish(`logs:${initialPayload.projectId}`, JSON.stringify(initialPayload))
          this.emit("exit", code)
        }
        // console.log(`Process exited with code ${code}`);
      });

    } catch (error) {
      this.stopDocker({ dockerPath: this.BUILD_SERVER_PATH, projectId: payload.projectId });
      this.emit("error", error)
    }


  }
}