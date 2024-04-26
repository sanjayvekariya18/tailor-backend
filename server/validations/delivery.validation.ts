export default class DeliveryValidation {
	public getAll = {
		delivery_id: "integer",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		order_id: "required|integer",
		date: "required|date",
		delivered_to: "required|string",
		delivered_mo: "string",
		delivery_details: "required|array|min:1",
		"delivery_details.*.category_id": "required|string",
		"delivery_details.*.qty": "required|integer",
		note: "string",
	};
	public edit = {
		date: "date",
		delivered_to: "string",
		delivered_mo: "string",
		total_delivered: "numeric",
		note: "string",
	};
}
