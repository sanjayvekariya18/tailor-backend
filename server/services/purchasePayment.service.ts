import { PurchasePayment } from "../models";
import { PurchasePaymentDTO } from "../dto";

export default class PurchasePaymentService {
	public findAll = async () => {
		return await PurchasePayment.findAll({
			attributes: ["purchase_id", "amount", "payment_date"],
			raw: true,
		});
	};

	public findOne = async (searchObject: any) => {
		return await PurchasePayment.findOne({
			where: {
				...searchObject,
			},
			attributes: ["purchase_id", "amount", "payment_date"],
			raw: true,
		});
	};

	public create = async (purchasePaymentData: PurchasePaymentDTO) => {
		return await PurchasePayment.create(purchasePaymentData).then(() => {
			return "purchase Payment Added successfully";
		});
	};

	public edit = async (purchasePaymentData: PurchasePaymentDTO, Purchase_payment_id: string) => {
		return await PurchasePayment.update(purchasePaymentData, { where: { Purchase_payment_id: Purchase_payment_id } }).then(() => {
			return "purchase Payment Edit successfully";
		});
	};
}
