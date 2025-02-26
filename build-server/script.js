const { exec } = require('chlid_process')
const path = require('path')
const fs = require('fs')

async function init() {
  const outputPath = path.join(__dirname, "repo")

  const p = exec(`cd ${outputPath} && bun install && bun run build`)

  p.stdout.on("data", log => {
    console.log(log.toString())
  })

  p.stdout.on("error", error => {
    console.log(error.toString())
  })

  p.on("close", () => {
    console.log("Build complete")
    const distFolderPath = path.join(__dirname, "repo", "dist")
    const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true })

    for (const file of distFolderContents) {
      if (fs.lstatSync(path.join(distFolderPath, file)).isDirectory()) {
        continue
      }


    }
  })

  console.log("from script.js")
}