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

 cp dist ../api-server/dist

 cd $BUILD_DIR || exit
 chmod +x ./main.sh

# going to the root directory
cd ../

echo "Running pm2"
pm2 start ecosystem.prod.config.js 

echo "Deployed Successfully"
