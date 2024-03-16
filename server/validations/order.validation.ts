export default class OrderValidation {
	public getAll = {
		searchTxt: "string",
		customer_id: "string",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		total: "required|numeric",
		payment: "numeric",
		order_date: "required|date",
		delivery_date: "required|after_or_equal:order_date",
		shirt_pocket: "required|numeric",
		pant_pocket: "required|numeric",
		pant_pinch: "required|numeric",
		type: "required|numeric",
		customer_id: "string",
		customer_name: "required|string",
		customer_mobile: "required|string",
		customer_address: "required|string",
		customer_measurement: "required|array|min:1",
		"customer_measurement.*.category_id": "required|string",
		"customer_measurement.*.measurement_id": "required|string",
		"customer_measurement.*.measurement": "required|string",
		"customer_measurement.*.measurement_2": "string",
	};

	public edit = {
		total: "required|numeric",
		payment: "numeric",
		order_date: "required|date",
		delivery_date: "required|after_or_equal:order_date",
		shirt_pocket: "required|numeric",
		pant_pocket: "required|numeric",
		pant_pinch: "required|numeric",
		type: "required|numeric",
		customer_id: "required|string",
		customer_name: "required|string",
		customer_mobile: "required|string",
		customer_address: "required|string",
		customer_measurement: "required|array|min:1",
		"customer_measurement.*.category_id": "required|string",
		"customer_measurement.*.measurement_id": "required|string",
		"customer_measurement.*.measurement": "required|string",
		"customer_measurement.*.measurement_2": "string",
	};
}
