#!/bin/bash

PROJECT_DIR="./"
API_SERVER_DIR="./api-server"
REVERSE_PROXY_DIR="./reverse-proxy"
FRONTEND_DIR="./frontend"

echo "Starting Deployment"

cd $PROJECT_DIR || exist

echo "Pulling latest changes"
git pull

# Build Frontend
 cd $FRONTEND_DIR || exit
 npm run build

 cp dist ../api-server/dist

# going to the root directory
cd ../

echo "Running pm2"
pm2 start ecosystem.prod.config.js 

echo "Deployed Successfully"
