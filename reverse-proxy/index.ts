import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import httpProxy from 'http-proxy'

dotenv.config();

const AWS_BUCKET_PATH = process.env.AWS_BUCKET_PATH

const proxy = httpProxy.createProxy()

const app = express();
const port = process.env.PORT || 3001;

app.use((req, res, next) => {
  if (!AWS_BUCKET_PATH) {
    next()
    return
  }

  const hostname = req.hostname;

  const subdomain = hostname.split('.')[0];

  const resolvePath = `${AWS_BUCKET_PATH}/${subdomain}`

  return proxy.web(req, res, { target: resolvePath, changeOrigin: true })

})

proxy.on("proxyReq", (proxyReq, req, res) => {
  const url = req.url;

  if (url === '/') {
    // if the user requests the root path, redirect them to the index.html file
    // so that they do not have to enter the ugly path like project.localhost:3000/index.html
    // instead they can use project.localhost:3000
    proxyReq.path += "index.html"
  }
})

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the proxy server");
});

app.listen(port, () => {
  console.log(`[reverse-proxy]: Reverse proxy is running on port ${port}`);
});