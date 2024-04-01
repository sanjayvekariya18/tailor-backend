export default class PurchaseValidation {
	public getAll = {
		start_date: "date",
		end_date: "date|after_or_equal:start_date",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		party_name: "required|string",
		amount: "required|numeric",
		payment: "numeric",
		details: "string",
		challan: "string",
		purchase_date: "required|date",
	};

	public edit = {
		party_name: "string",
		amount: "numeric",
		payment: "numeric",
		details: "string",
		challan: "string",
		purchase_date: "date",
	};
}
