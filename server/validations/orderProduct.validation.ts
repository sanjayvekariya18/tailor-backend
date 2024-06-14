import { WORKER_ASSIGN_TASK } from "../constants";

export default class OrderProductValidation {
	public getAll = {
		assign_date: "date",
		worker_id: "integer",
		order_id: "integer",
		customer_id: "integer",
		mobile_no: "string",
		customer_name: "string",
		status: "in:" + Object.values(WORKER_ASSIGN_TASK),
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
