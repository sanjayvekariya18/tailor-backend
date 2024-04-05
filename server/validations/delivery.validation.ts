export default class DeliveryValidation {
	public getAll = {
		delivery_id: "string",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		date: "required|date",
		delivered_to: "required|string",
		delivered_mo: "string",
		total_delivered: "required|numeric",
		note: "required|string",
	};
	public edit = {
		date: "date",
		delivered_to: "string",
		delivered_mo: "string",
		total_delivered: "numeric",
		note: "string",
	};
}
