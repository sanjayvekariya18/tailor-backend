export default class PurchasePaymentValidation {
	public create = {
		purchase_id: "required|integer",
		amount: "required|numeric",
		payment_date: "required|date",
	};
}
