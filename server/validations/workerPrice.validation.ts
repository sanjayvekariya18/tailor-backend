export default class WorkerPriceValidation {
	public getAll = {
		worker_id: "string",
		category_id: "string",
		searchTxt: "string",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		worker_id: "required|string",
		category_id: "required|string",
		price: "required|numeric",
	};
}
