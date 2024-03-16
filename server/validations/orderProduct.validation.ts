export default class OrderValidation {
	public getAll = {
		start_date: "date",
		end_date: "date|after_or_equal:start_date",
		customer_id: "string",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};
	public create = {};
}
