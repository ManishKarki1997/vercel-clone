import queryString from "query-string"
import { api } from "@/lib/api"
import { Dashboard } from "../schema/app.schema"

export const listDashboardAction = async (payload: Dashboard) => {
  const params = queryString.stringify(payload)
  const response = await api.get(`/app/dashboard?${params}`, { withCredentials: true })
  const dashboardResponse = response.data?.data || []
  return dashboardResponse
}