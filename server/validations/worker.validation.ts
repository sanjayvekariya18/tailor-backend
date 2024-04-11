export default class WorkerValidation {
	public getAll = {
		searchTxt: "string",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		worker_name: "required|string",
		worker_mobile: "required|string",
		worker_address: "required|string",
		// worker_price: "required|array|min:1",
		// "worker_price.*.category_id": "required|string",
		// "worker_price.*.price": "required|numeric",
	};

	public edit = {
		worker_name: "string",
		worker_mobile: "string",
		worker_address: "string",
		// worker_price: "array|min:1",
		// "worker_price.*.category_id": "required|string",
		// "worker_price.*.price": "required|numeric",
	};

	public work_assign_task = {
		worker_id: "required|string",
		customer_id: "required|string",
	};
}
