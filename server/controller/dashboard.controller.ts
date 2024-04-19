import { NextFunction, Request, Response } from "express";
import { DashboardService } from "../services";
import { PaginationData } from "../dto";

export default class DashboardController {
	private service = new DashboardService();

	public get_counts = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.get_counts();
			return res.api.create(data);
		},
	};

	public get_pending_orders = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.get_pending_orders(new PaginationData(req.query));
			return res.api.create(data);
		},
	};

	public get_pending_delivery_orders = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.get_pending_delivery_orders(new PaginationData(req.query));
			return res.api.create(data);
		},
	};
}
