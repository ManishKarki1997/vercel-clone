FROM ubuntu:focal

RUN apt update
RUN apt install -y curl
RUN apt install unzip
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt upgrade -y
RUN apt install -y nodejs
RUN apt install git -y

WORKDIR /home/app

COPY main.sh main.sh
COPY script.js script.js
COPY package.json .
# intentionally not including package-lock because of this bug https://github.com/npm/cli/issues/4828

RUN npm install 

RUN chmod +x main.sh
RUN chmod +x script.js

ENTRYPOINT [ "/home/app/main.sh" ]
