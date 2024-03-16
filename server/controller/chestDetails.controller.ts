import { NextFunction, Request, Response } from "express";
import { ChestDetailsService } from "../services";

export default class ChestDetailsController {
	private chestDetailsService = new ChestDetailsService();

	public findAll = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.chestDetailsService.findAll();
			return res.api.create(data);
		},
	};
}
