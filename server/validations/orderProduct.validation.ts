import { WORKER_ASSIGN_TASK } from "../constants";

export default class OrderProductValidation {
	public getAll = {
		start_date: "date",
		end_date: "date|after_or_equal:start_date",
		customer_id: "string",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};
	public create = {
		order_id: "required|string",
		category_id: "required|string",
		worker_id: "required|string",
		qty: "required|numeric",
		price: "required|numeric",
		status: "string|in:" + Object.keys(WORKER_ASSIGN_TASK),
		assign_date: "required|date",
	};
}
