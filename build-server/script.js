const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require("dotenv");
const mime = require('mime-types')
const Redis = require("ioredis");
const { Config } = require('./config');
const { publishLog, publisher } = require('./redis');


dotenv.config();

const s3Client = new S3Client({
  region: Config.AWS_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: Config.AWS_ACCESS_KEY,
    secretAccessKey: Config.AWS_SECRET_ACCESS_KEY
  }
});

const decodeStringifiedEnv = (stringified) => 
  stringified
  .split(',')
  .reduce((obj, pair) => {
    const [key, value] = pair.split('==');
    obj[key] = value; // Convert value to proper type if necessary (e.g., parse integers, booleans)
    return obj;
  }, {});


let PROJECT_ID = Config.PROJECT_ID;
const PROJECT_SLUG = Config.PROJECT_SLUG;
const PROJECT_OUTPUT_FOLDER = Config.PROJECT_OUTPUT_FOLDER;
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

function updateViteConfig({viteConfigPaths}){

  for(const viteConfigPath of viteConfigPaths){

    if(!fs.existsSync(viteConfigPath)){
      console.log(`${viteConfigPath} doesn't exist`)
      continue
    }
    
    // Read the original config
    const originalConfig = fs.readFileSync(viteConfigPath, 'utf8');
    
    // Save backup
fs.writeFileSync(`${viteConfigPath}.backup`, originalConfig);

// Modify the config
let newConfig = originalConfig;
if (newConfig.includes('base:')) {
  // Replace any line containing "base:" with a line that sets base to empty string
  newConfig = newConfig.replace(/^.*base:.*$/m, `  base: '',`);
} else {
  // If base is not defined, add it
  newConfig = newConfig.replace(/defineConfig\(\{/g, `defineConfig({\n  base: '',`);
}

// Write the modified config
fs.writeFileSync(viteConfigPath, newConfig);

console.log(`Modified ${viteConfigPath} to use relative paths`);
}

}


function replaceAssetPaths({htmlPath,projectId}) {

let html = fs.readFileSync(htmlPath, 'utf8');


// Replace any path ending with /assets/filename.ext with ./assets/filename.ext
html = html.replace(/(src|href)=("|')(?:.*?)\/assets\/([^"']+)("|')/g, `$1=$2./assets/$3$4`);

// Handle root-level files too - convert to ./assets/filename.ext
html = html.replace(/(src|href)=("|')\/(?!assets\/)([^"'\/]+\.[^"'\/]+)("|')/g, `$1=$2./assets/$3$4`);

// // Fix asset references - look for src="/assets/ or href="/assets/ patterns
// html = html.replace(/(src|href)=("|')\/assets\//g, `$1=$2/__outputs/${projectId}/assets/`);
// // Also fix assets without leading slash
// html = html.replace(/(src|href)=("|')assets\//g, `$1=$2__outputs/${projectId}/assets/`);

// // Fix root-level assets (like /vite.svg)
// html = html.replace(/(src|href)=("|')\/([^\/][^"']*\.(svg|png|jpg|jpeg|gif|ico|webp|css|js))/g, 
//                    `$1=$2/__outputs/${projectId}/$3`);

fs.writeFileSync(htmlPath, html);
}

async function init() {  
  // PROJECT_ID="9090"
  await waitFor(1000)
  
  const outputPath = path.join(__dirname, "builds", PROJECT_ID);
  makeBuildPathIfNotExist(outputPath)
  
  publishLog({
    metadata:METADATA,
    projectId: PROJECT_ID,      
    log: "Running install and build commands", 
    type:"info"
  })
 
  
  // updateViteConfig({viteConfigPaths:[path.join(outputPath, "vite.config.js"),path.join(outputPath, "vite.config.ts")]});        

  const p = exec(`cd ${outputPath} &&  npm install --legacy-peer-deps --include=optional && npm run build`);

  p.stdout.on("data", log => {
    publishLog({
      metadata:METADATA,
      projectId: PROJECT_ID,      
      log: log.toString(),
      type:"info"
    })  
  });

  p.stdout.on("error", error => {
    publishLog({
      metadata:METADATA,
      projectId: PROJECT_ID,      
      log: error.toString(),
      isCompleted:true,
      hasError:true
    })
    
    console.log("Error", error);
    process.exit(1)
  });

  p.on("close", async () => {    
    publishLog({
      metadata:METADATA,
      projectId: PROJECT_ID,      
      log: "Build Complete",
      type:"success",
    })
    const distFolderPath = path.join(outputPath, PROJECT_OUTPUT_FOLDER);
    const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });


    publishLog({
      metadata:METADATA,
      projectId: PROJECT_ID,      
      log: "Preparing to upload built folder",
      type:"info"
    })

    for (let filename of distFolderContents) {
      await waitFor(100)
      let filePath = path.join(distFolderPath, filename)

      if (fs.lstatSync(filePath).isDirectory()) continue;

      if(filename === "index.html"){
      // update the html file with the correct asset paths
        replaceAssetPaths({htmlPath:filePath, projectId:PROJECT_ID});        
      }

      
      publishLog({
        metadata:METADATA,
        projectId: PROJECT_ID,      
        log: `Uploading ${filename}`,
        type:"info"
      })      

      const command = new PutObjectCommand({
        Bucket: Config.AWS_S3_BUCKET,
        Key: `__outputs/${PROJECT_ID}/${filename}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath)
      });

      await s3Client.send(command);
      
      publishLog({
        metadata:METADATA,
        projectId: PROJECT_ID,      
        log: `Uploaded ${filename}`,
        type:"info"
      })   

    }


    publishLog({
      metadata:METADATA,
      projectId: PROJECT_ID,      
      log: "Deployed Successfully.",
      type:"success"
    })

    await waitFor(2000)

    
    publishLog({
      metadata:METADATA,
      projectId: PROJECT_ID,      
      log: "Process Complete",
      isCompleted:true,
      hasError:false
    })

    publisher?.disconnect()
    process.exit(0)
  });

}

init();