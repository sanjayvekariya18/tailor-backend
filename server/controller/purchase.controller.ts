import { NextFunction, Request, Response } from "express";
import { isEmpty } from "../utils/helper";
import { PurchaseService } from "../services";
import { PurchaseValidation } from "../validations";
import { EditPurchaseDTO, SearchPurchaseDTO, createPurchaseDTO } from "../dto";

export default class PurchaseController {
	private purchaseService = new PurchaseService();
	private purchaseValidation = new PurchaseValidation();

	public getAll = {
		validation: this.purchaseValidation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.purchaseService.getAll(new SearchPurchaseDTO(req.query));
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.purchaseValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const purchaseData = new createPurchaseDTO(req.body);
			const data = await this.purchaseService.create(purchaseData);
			return res.api.create(data);
		},
	};

	public edit = {
		validation: this.purchaseValidation.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const purchase_id: string = req.params["purchase_id"] as string;
			const reqPurchaseData = new EditPurchaseDTO(req.body);
			const checkPurchaseData = await this.purchaseService.findOne({ purchase_id: purchase_id });
			if (isEmpty(checkPurchaseData)) {
				return res.api.badResponse({ message: "Purchase Data Not Found" });
			}
			const data = await this.purchaseService.edit(reqPurchaseData, purchase_id);
			return res.api.create(data);
		},
	};
}
