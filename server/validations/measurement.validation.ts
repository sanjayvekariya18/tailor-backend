export default class MeasurementValidation {
	public getAll = {
		searchTxt: "string",
		category_id: "integer",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		category_id: "required|integer",
		measurement_name: "required|string",
	};
}
