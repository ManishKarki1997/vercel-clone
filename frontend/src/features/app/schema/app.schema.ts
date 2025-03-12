import { z } from "zod"

export const DashboardSchema = z.object({
  page: z.number().default(1).optional(),
  limit: z.number().default(5).optional()
})
export type Dashboard = z.infer<typeof DashboardSchema>