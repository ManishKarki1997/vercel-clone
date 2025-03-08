module.exports = {
  apps: [
    {
      name: "vercel-clone-api-server",      
      script: "npm",
      args: "run dev",    
      cwd:"./api-server"
    },
    {
      name: "vercel-clone-reverse-proxy",      
      script: "npm",
      args: "run dev",      
      cwd:"./reverse-proxy"
    },
    
    {
      name: "vercel-clone-frontend",      
      script: "npm",
      args: "run dev",    
      cwd:"./frontend"
    },
  ],
};
