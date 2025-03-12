import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import httpProxy from 'http-proxy'
import axios from 'axios'
import { errorHandler } from "./middlewares/error-handler";

dotenv.config();

const AWS_BUCKET_PATH = process.env.AWS_BUCKET_PATH

const proxy = httpProxy.createProxy()

const app = express();
const port = process.env.PORT || 3001;
const API_SERVER_URL = process.env.API_SERVER_URL

const getProjectIdBySlug = async (slug: string) => {
  if (!API_SERVER_URL) return ""
  const response = await axios.get(`${API_SERVER_URL}/api/v1/projects/slug-to-id/${slug}`)
  return response.data?.data || ""
}

app.get("/not-found", (req: Request, res: Response) => {
  res.send("Not found");
});

app.use(async (req, res, next) => {
  try {
    if (!AWS_BUCKET_PATH) {
      next()
      return
    }

    const hostname = req.hostname || "";

    const subdomain = !hostname ? "" : hostname.split('.')[0];

    const projectId = await getProjectIdBySlug(subdomain)
    console.log("projectId", projectId)
    if (!projectId) {
      return res.send("Project not found")
    }


    const resolvePath = `${AWS_BUCKET_PATH}/${projectId}`


    return proxy.web(req, res, { target: resolvePath, changeOrigin: true })
  } catch (error) {
    console.error("Error getting project details", error)
    return res.send("Not found")
  }

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


app.use(errorHandler)
app.listen(port, () => {
  console.log(`[reverse-proxy]: Reverse proxy is running on port ${port}`);
});