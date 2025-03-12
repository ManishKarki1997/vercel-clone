import { z } from "zod"


export const DashboardSchema = z.object({
  userId: z.string(),
  page: z.number().default(1),
  limit: z.number().default(5)
})
export type Dashboard = z.infer<typeof DashboardSchema>
