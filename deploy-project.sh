#!/bin/bash

PROJECT_DIR="./"
API_SERVER_DIR="./api-server"
REVERSE_PROXY_DIR="./reverse-proxy"
BUILD_DIR="./build-server"
FRONTEND_DIR="./frontend"

echo "Starting Deployment"

cd $PROJECT_DIR || exist

echo "Pulling latest changes"
git pull

# Build Frontend
 cd $FRONTEND_DIR || exit
 npm run build

 cp -r dist ../api-server/dist

# going to the root directory
cd ../

 cd $BUILD_DIR || exit
 chmod +x ./main.sh


# going to the root directory
cd ../

echo "Running pm2"
pm2 start ecosystem.prod.config.js 
pm2 save

echo "Deployed Successfully"
