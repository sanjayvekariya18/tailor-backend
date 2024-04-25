import { Purchase, PurchasePayment } from "../models";
import { PurchasePaymentDTO } from "../dto";
import { BadResponseHandler } from "../errorHandler";
import { executeTransaction } from "../config/database";
import { Transaction } from "sequelize";

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

	public create = async (purchasePaymentData: PurchasePaymentDTO, purchaseData: any) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await PurchasePayment.create(purchasePaymentData, { transaction }).then(async (data) => {
				if (purchaseData.payment == null) {
					purchaseData.payment = 0;
				}
				let purchase_data = {
					payment: Number(purchaseData.payment) + Number(data.amount),
					outstand: Number(purchaseData.amount) - (Number(purchaseData.payment) + Number(data.amount)),
				};
				if (purchase_data.outstand < 0) {
					throw new BadResponseHandler("Payment amount greater then outstanding");
				}
				await Purchase.update(purchase_data, { where: { purchase_id: purchasePaymentData.purchase_id }, transaction });
				return "Purchase payment added successfully";
			});
		});
	};

	public edit = async (purchasePaymentData: PurchasePaymentDTO, Purchase_payment_id: number, purchaseData: any) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await PurchasePayment.update(purchasePaymentData, { where: { Purchase_payment_id: Purchase_payment_id } }).then(async (data) => {
				let edit_data = await this.PurchasePaymentData(purchaseData, transaction);
				if (edit_data.outstand < 0) {
					throw new BadResponseHandler("Payment amount greater then outstanding");
				}
				await Purchase.update(edit_data, { where: { purchase_id: purchasePaymentData.purchase_id }, transaction });
				return "Purchase payment edit successfully";
			});
		});
	};

	public delete = async (purchase_payment_id: number, purchaseData: any) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await PurchasePayment.destroy({ where: { Purchase_payment_id: purchase_payment_id }, transaction }).then(async () => {
				let data = await this.PurchasePaymentData(purchaseData, transaction);
				return await Purchase.update(data, { where: { purchase_id: purchaseData.purchase_id }, transaction }).then(() => {
					return "Purchase payment deleted successfully";
				});
			});
		});
	};

	public PurchasePaymentData = async (purchaseData: any, transaction: Transaction) => {
		let amount = 0;
		await PurchasePayment.findAll({ where: { purchase_id: purchaseData.purchase_id }, raw: true, transaction }).then((data) => {
			return data.map((item: any) => {
				amount += item.amount;
			});
		});
		if (purchaseData.payment == null) {
			purchaseData.payment = 0;
		}
		let purchase_data = {
			payment: Number(amount),
			outstand: Number(purchaseData.amount) - Number(amount),
		};
		return purchase_data;
	};
}
