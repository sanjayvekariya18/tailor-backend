export default class PurchasePaymentValidation {
	public create = {
		purchase_id: "required|string",
		amount: "required|numeric",
		payment_date: "required|date",
	};
}
