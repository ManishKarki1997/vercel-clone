#!/bin/bash

export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"
export PROJECT_ID="$PROJECT_ID"

rm -rf "/home/app/builds/$PROJECT_ID" #otherwise git will throw fatal: destination path already exists error
git clone "$GIT_REPOSITORY_URL" "/home/app/builds/$PROJECT_ID"

cd "/home/app/builds/$PROJECT_ID"
rm -rf package-lock.json
cd ../../

#important to include the --include=optional otherwise we get weird gnu linux error
# https://github.com/npm/cli/issues/4828
#npm install --legacy-peer-deps --include=optional 
#npm run build

# exec pnpm script.js
exec node script.js
