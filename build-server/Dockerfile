FROM ubuntu:focal

RUN apt update
RUN apt install -y curl
RUN apt install unzip
RUN apt upgrade -y
#RUN curl -L -o /usr/local/bin/pnpm https://github.com/pnpm/pnpm/releases/download/v8.6.12/pnpm-linux-x64
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
#ENV PNPM_HOME=/usr/local/bin/
#RUN chmod +x /usr/local/bin/pnpm
RUN apt install -y nodejs
RUN apt install git -y

WORKDIR /home/app

COPY redis.js redis.js
COPY config.js config.js
COPY script.js script.js
COPY main.sh main.sh
COPY package.json .
# intentionally not including package-lock because of this bug https://github.com/npm/cli/issues/4828

#RUN pnpm install 
RUN npm install 

RUN chmod +x main.sh
RUN chmod +x script.js

#ENTRYPOINT [ "/home/app/main.sh" ]
