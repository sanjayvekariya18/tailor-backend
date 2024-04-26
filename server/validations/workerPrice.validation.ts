export default class WorkerPriceValidation {
	public getAll = {
		worker_id: "integer",
		category_id: "integer",
		searchTxt: "string",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		worker_id: "required|integer",
		category_id: "required|integer",
		price: "required|numeric",
	};
}
