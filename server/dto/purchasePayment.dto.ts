export class PurchasePaymentDTO {
	purchase_id: number;
	amount: number;
	payment_date: Date;
	constructor(data: any) {
		this.purchase_id = data.purchase_id;
		this.amount = data.amount;
		this.payment_date = data.payment_date;
	}
}
