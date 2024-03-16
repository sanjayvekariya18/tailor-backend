export default class CustomerValidation {
	public getAll = {
		searchTxt: "string",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		customer_name: "required|string",
		customer_mobile: "required|string",
		customer_address: "required|string",
	};

	public edit = {
		customer_name: "string",
		customer_mobile: "string",
		customer_address: "string",
	};
}
