export const Config = {
  ApiBaseUrl: import.meta.env.VITE_APP_BACKEND_URL,
  SocketUrl: import.meta.env.VITE_APP_SOCKET_URL || "http://localhost:3002",
  PORT: import.meta.env.VITE_APP_SERVER_PORT || 5173,
}