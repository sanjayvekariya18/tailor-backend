import { NextFunction, Request, Response } from "express";
import { isEmpty } from "../utils/helper";
import { PurchasePaymentService, PurchaseService } from "../services";
import { PurchasePaymentValidation } from "../validations";
import { PurchasePaymentDTO } from "../dto";
import { BadResponseHandler } from "../errorHandler";

export default class PurchaseController {
	private purchaseService = new PurchaseService();
	private purchasePaymentService = new PurchasePaymentService();
	private purchasePaymentValidation = new PurchasePaymentValidation();

	public create = {
		validation: this.purchasePaymentValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const purchasePaymentData = new PurchasePaymentDTO(req.body);
			const checkPurchaseID = await this.purchaseService.findOne({ purchase_id: purchasePaymentData.purchase_id });
			if (checkPurchaseID == null) {
				throw new BadResponseHandler("Purchase ID Not Found");
			}
			const data = await this.purchasePaymentService.create(purchasePaymentData, checkPurchaseID);
			return res.api.create(data);
		},
	};

	public edit = {
		validation: this.purchasePaymentValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const purchase_payment_id: string = req.params["purchase_payment_id"] as string;
			const reqPurchasePaymentData = new PurchasePaymentDTO(req.body);
			const checkPurchasePaymentData = await this.purchasePaymentService.findOne({ purchase_payment_id: purchase_payment_id });
			if (isEmpty(checkPurchasePaymentData)) {
				return res.api.badResponse({ message: "Purchase Payment Data Not Found" });
			}
			const checkPurchaseID = await this.purchaseService.findOne({ purchase_id: reqPurchasePaymentData.purchase_id });
			if (checkPurchaseID == null) {
				throw new BadResponseHandler("Purchase ID Not Found");
			}
			const data = await this.purchasePaymentService.edit(reqPurchasePaymentData, purchase_payment_id, checkPurchaseID);
			return res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const purchasePaymentId: string = req.params["purchase_payment_id"] as string;
			const checkPurchasePaymentData = await this.purchasePaymentService.findOne({ purchase_payment_id: purchasePaymentId });
			if (checkPurchasePaymentData == null) {
				return res.api.badResponse({ message: "Payment Data Not Found" });
			}
			const checkPurchaseID = await this.purchaseService.findOne({ purchase_id: checkPurchasePaymentData.purchase_id });
			if (checkPurchaseID == null) {
				throw new BadResponseHandler("Purchase ID Not Found");
			}
			let data = await this.purchasePaymentService.delete(purchasePaymentId, checkPurchaseID);
			return res.api.create(data);
		},
	};
}
