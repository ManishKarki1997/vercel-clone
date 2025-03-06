const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require("dotenv");
const mime = require('mime-types')
const Redis = require("ioredis");
const { Config } = require('./config');
const { publishLog } = require('./redis');


dotenv.config();

const s3Client = new S3Client({
  region: Config.AWS_REGION,
  credentials: {
    accessKeyId: Config.AWS_ACCESS_KEY,
    secretAccessKey: Config.AWS_SECRET_ACCESS_KEY
  }
});

const decodeStringifiedEnv = (stringified) => 
  stringified
  .split(',')
  .reduce((obj, pair) => {
    const [key, value] = pair.split(':');
    obj[key] = value; // Convert value to proper type if necessary (e.g., parse integers, booleans)
    return obj;
  }, {});


const PROJECT_ID = Config.PROJECT_ID;
const PROJECT_SLUG = Config.PROJECT_SLUG;
const METADATA = Config.PROJECT_METADATA ? decodeStringifiedEnv(Config.PROJECT_METADATA) : {};


// let logId = 1;
// if (Config.isDebugMode) {
//   setInterval(() => {
//     publishLog({
//       deploymentId: PROJECT_ID,
//       // deploymentId: "2bd37c0a-91b1-4787-bb47-ec1c927f4091",
//       log: `This is log #${logId} from the server`
//     })
//     logId++
//   }, 1000)
// }

async function waitFor(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const makeBuildPathIfNotExist = (outputPath) => {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath)
  }
}

async function init() {
  const outputPath = path.join(__dirname, "builds", PROJECT_ID);
  makeBuildPathIfNotExist(outputPath)
  
  publishLog({
    metadata:METADATA,
    deploymentId: PROJECT_ID,      
    log: "Running install and build commands", 
    type:"info"
  })
  
  const p = exec(`cd ${outputPath} &&  npm install --legacy-peer-deps --include=optional && npm run build`);

  p.stdout.on("data", log => {
    publishLog({
      metadata:METADATA,
      deploymentId: PROJECT_ID,      
      log: log.toString(),
      type:"info"
    })  
  });

  p.stdout.on("error", error => {
    publishLog({
      metadata:METADATA,
      deploymentId: PROJECT_ID,      
      log: error.toString(),
      isCompleted:true,
      hasError:true
    })
    
    console.log("Error", error);
  });

  p.on("close", async () => {    
    publishLog({
      metadata:METADATA,
      deploymentId: PROJECT_ID,      
      log: "Build Complete",
      type:"success",
    })
    const distFolderPath = path.join(outputPath, "dist");
    const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });


    publishLog({
      metadata:METADATA,
      deploymentId: PROJECT_ID,      
      log: "Preparing to upload built folder",
      type:"info"
    })

    for (const file of distFolderContents) {
      await waitFor(100)
      const filePath = path.join(distFolderPath, file)

      if (fs.lstatSync(filePath).isDirectory()) continue;


      
      publishLog({
        metadata:METADATA,
        deploymentId: PROJECT_ID,      
        log: `Uploading ${file}`,
        type:"info"
      })      

      const command = new PutObjectCommand({
        Bucket: Config.AWS_S3_BUCKET,
        Key: `__outputs/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath)
      });

      await s3Client.send(command);
      
      publishLog({
        metadata:METADATA,
        deploymentId: PROJECT_ID,      
        log: `Uploaded ${file}`,
        type:"info"
      })   

    }


    publishLog({
      metadata:METADATA,
      deploymentId: PROJECT_ID,      
      log: "Deployed Successfully.",
      type:"success"
    })

    await waitFor(2000)

    
    publishLog({
      metadata:METADATA,
      deploymentId: PROJECT_ID,      
      log: "Process Complete",
      isCompleted:true,
      hasError:false
    })

    process.exit(0)
  });

}

init();