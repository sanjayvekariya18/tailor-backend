export default class OrderProductValidation {
	public getAll = {
		start_date: "date",
		end_date: "date|after_or_equal:start_date",
		customer_id: "integer",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		order_id: "required|integer",
		category_id: "required|integer",
		worker_id: "required|integer",
		qty: "required|numeric",
		assign_date: "required|date",
	};

	public bulkCreated = {
		worker_id: "required|integer",
		assign_date: "required|date",
		worker_task: "required|array|min:1",
		"worker_task.*.order_id": "required|integer",
		"worker_task.*.category_id": "required|integer",
		"worker_task.*.qty": "required|integer",
		"worker_task.*.price": "required|integer",
	};

	public getWorkerAssignTask = {
		order_id: "required|integer",
		category_id: "required|integer",
	};
}
