import type { Request, Response } from "express"
import AppService from "../services/app.service"

const dashboard = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.sub

  const payload = {
    userId: userId!,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 1,
  }

  const dashboard = await AppService.dashboard(payload)
  return res.status(200).json({
    message: "Dashboard fetched successfully",
    success: true,
    data: dashboard
  })
}

const AppController = {
  dashboard
}

export default AppController