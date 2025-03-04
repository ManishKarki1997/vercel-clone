const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require("dotenv");
const mime = require('mime-types')
const Redis = require("ioredis");
const { Config } = require('./config/config');
const { publishLog } = require('./redis');


dotenv.config();

const s3Client = new S3Client({
  region: Config.AWS_REGION,
  credentials: {
    accessKeyId: Config.AWS_ACCESS_KEY,
    secretAccessKey: Config.AWS_SECRET_ACCESS_KEY
  }
});


const PROJECT_ID = Config.PROJECT_ID;

let logId = 1;
if (Config.isDebugMode) {
  setInterval(() => {
    publishLog({
      deploymentId: PROJECT_ID,
      log: `This is log #${logId} from the server`
    })
    logId++
  }, 1000)
}

async function init() {
  const outputPath = path.join(__dirname, "repo");

  const p = exec(`cd ${outputPath} &&  npm install --legacy-peer-deps --include=optional && npm run build`);

  p.stdout.on("data", log => {
    console.log("Building app", log);
  });

  p.stdout.on("error", error => {
    console.log("Error", error);
  });

  p.on("close", async () => {
    console.log("Build complete");    

    const distFolderPath = path.join(__dirname, "repo", "dist");
    const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

    for (const file of distFolderContents) {
      const filePath = path.join(distFolderPath, file)

      if (fs.lstatSync(filePath).isDirectory()) continue;



      console.log('uploading', file);
      // publishLog(`uploading ${file}`);

      const command = new PutObjectCommand({
        Bucket: Config.AWS_S3_BUCKET,
        Key: `__outputs/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath)
      });

      await s3Client.send(command);
      // publishLog(`uploaded ${file}`);
      console.log('uploaded', filePath);


    }

    process.exit(1)
  });

}

// init();