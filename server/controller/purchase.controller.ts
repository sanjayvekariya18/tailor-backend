import { NextFunction, Request, Response } from "express";
import { isEmpty } from "../utils/helper";
import { PurchasePaymentService, PurchaseService } from "../services";
import { PurchaseValidation } from "../validations";
import { EditPurchaseDTO, SearchPurchaseDTO, createPurchaseDTO } from "../dto";
import { BadResponseHandler } from "../errorHandler";

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
			const purchase_id: number = Number((req.params["purchase_id"] as string) || 0);
			const reqPurchaseData = new EditPurchaseDTO(req.body);
			const checkPurchaseData = await this.purchaseService.findOne({ purchase_id: purchase_id });
			if (isEmpty(checkPurchaseData)) {
				return res.api.badResponse({ message: "Purchase Data Not Found" });
			}
			let outstand = checkPurchaseData?.outstand;
			if (reqPurchaseData.amount == undefined) {
				if (checkPurchaseData?.amount != undefined && checkPurchaseData?.amount != null) {
					outstand = checkPurchaseData?.amount - checkPurchaseData?.payment;
				}
			} else {
				if (checkPurchaseData?.payment != undefined) {
					outstand = reqPurchaseData.amount - checkPurchaseData?.payment;
				}
			}
			if (outstand != undefined) {
				if (outstand < 0) {
					throw new BadResponseHandler("your amount less then payment");
				}
			}
			const data = await this.purchaseService.edit({ ...reqPurchaseData, outstand: outstand }, purchase_id);
			return res.api.create(data);
		},
	};
}
