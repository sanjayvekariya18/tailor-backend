export default class WorkerPaymentValidation {
	public getAll = {
		start_date: "date",
		end_date: "date|after_or_equal:start_date",
		worker_id: "integer",
		type: "integer|min:0|max:1",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		worker_id: "required|integer",
		amount: "required|numeric",
		payment_date: "required|date",
	};

	public edit = {
		worker_id: "integer",
		amount: "numeric",
		payment_date: "date",
	};
}
