export default class MeasurementValidation {
	public getAll = {
		searchTxt: "string",
		category_id: "string",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		category_id: "required|string",
		measurement_name: "required|string",
	};
}
