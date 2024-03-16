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
	};

	public edit = {
		worker_name: "string",
		worker_mobile: "string",
		worker_address: "string",
	};
}
