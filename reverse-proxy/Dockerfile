FROM node:18

WORKDIR /home/reverse-proxy

COPY . .
RUN npm install
EXPOSE 9001
CMD ["npm", "run", "dev"] 
