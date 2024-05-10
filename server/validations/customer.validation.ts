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

	public changePassword = {
		old_password: "required|string",
		new_password: "required|string",
		confirm_password: "required|string",
	};

	public createOrEditCustomerMeasurement = {
		customer_id: "required|integer",
		measurement: "required|array|min:1",
		"measurement.*.category_id": "required|integer",
		"measurement.*.measurement_id": "required|integer",
		"measurement.*.measurement": "required|string",
		"measurement.*.measurement_2": "string",
	};
}
