import { BILL_STATUS } from "../constants";

export default class OrderValidation {
	public getAll = {
		customer_id: "string",
		start_date: "date",
		end_date: "date|after_or_equal:start_date",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public getBill = {
		customer_id: "string",
		order_id: "string",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public findOneMeasurement = {
		customer_id: "required|string",
		customer_mobile: "string",
	};

	public getCustomerBill = {
		bill_no: "required|numeric",
	};

	public deliveryDateRemain = {
		start_date: "date",
		end_date: "date|after_or_equal:start_date",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public getCustomerPaymentData = {
		start_date: "date",
		end_date: "date|after_or_equal:start_date",
		customer_id: "string",
		bill_status: "in:" + Object.values(BILL_STATUS),
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};
	public OrderPayment = {
		payment: "required|string",
		payment_date: "required|date",
	};

	public create = {
		total: "required|numeric",
		payment: "numeric",
		order_date: "required|date",
		delivery_date: "required|after_or_equal:order_date",
		shirt_pocket: "required|numeric",
		pant_pocket: "required|numeric",
		pant_pinch: "required|numeric",
		type: "numeric",
		customer_id: "string",
		customer_name: "required|string",
		customer_mobile: "required|string",
		customer_address: "required|string",
		// customer_measurement: "required|array|min:1",
		// "customer_measurement.*.category_id": "required|string",
		// "customer_measurement.*.measurement_id": "required|string",
		// "customer_measurement.*.measurement": "required|string",
		// "customer_measurement.*.measurement_2": "string",
		// // order_details: "required|array|min:1",
		// // "order_details.*.category_id": "required|string",
		// // "order_details.*.qty": "required|string",
		// // "order_details.*.price": "required|string",
	};

	public edit = {
		total: "required|numeric",
		payment: "numeric",
		order_date: "required|date",
		delivery_date: "required|after_or_equal:order_date",
		shirt_pocket: "required|numeric",
		pant_pocket: "required|numeric",
		pant_pinch: "required|numeric",
		type: "numeric",
		// customer_id: "required|string",
		// customer_name: "required|string",
		// customer_mobile: "required|string",
		// customer_address: "required|string",
		// customer_measurement: "required|array|min:1",
		// "customer_measurement.*.category_id": "required|string",
		// "customer_measurement.*.measurement_id": "required|string",
		// "customer_measurement.*.measurement": "required|string",
		// "customer_measurement.*.measurement_2": "string",
	};
}
