#!/bin/bash

export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"

git clone "$GIT_REPOSITORY_URL" /home/app/repo

cd /home/app/repo
rm -rf package-lock.json
cd ../
#important to include the --include=optional otherwise we get weird gnu linux error
# https://github.com/npm/cli/issues/4828
#npm install --legacy-peer-deps --include=optional 
#npm run build

#ls
exec node script.js
