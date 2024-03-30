export default class OrderProductValidation {
	public getAll = {
		start_date: "date",
		end_date: "date|after_or_equal:start_date",
		customer_id: "string",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};
	public create = {
		// order_product_id: "required|string",
		order_id: "required|string",
		category_id: "required|string",
		worker_id: "required|string",
		qty: "required|numeric",
		assign_date: "required|date",
	};
}
