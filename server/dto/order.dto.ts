export class SearchOrderDTO {
	start_date?: Date;
	end_date?: Date;
	customer_id?: string;
	mobile_no?: string;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.start_date != undefined && data.start_date != "" ? (this.start_date = data.start_date) : delete this.start_date;
		data.end_date != undefined && data.end_date != "" ? (this.end_date = new Date(data.end_date + " 23:59:59.0")) : delete this.end_date;
		data.customer_id != undefined && data.customer_id != "" ? (this.customer_id = data.customer_id) : delete this.customer_id;
		data.mobile_no != undefined && data.mobile_no != "" ? (this.mobile_no = data.mobile_no) : delete this.mobile_no;
		this.page = data.page != undefined && data.page != "" ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined && data.rowsPerPage != "" ? Number(data.rowsPerPage) : 10;
	}
}

export class findCustomerMeasurementDTO {
	customer_id?: string;
	mobile_no?: string;

	constructor(data: any) {
		data.customer_id != undefined && data.customer_id != "" ? (this.customer_id = data.customer_id) : delete this.customer_id;
		data.mobile_no != undefined && data.mobile_no != "" ? (this.mobile_no = data.mobile_no) : delete this.mobile_no;
	}
}

export class SearchDeliveryOrderRemainDTO {
	start_date?: Date;
	end_date?: Date;
	page: number;
	rowsPerPage: number;
	constructor(data: any) {
		data.start_date != undefined ? (this.start_date = data.start_date) : delete this.start_date;
		data.end_date != undefined ? (this.end_date = new Date(data.end_date + " 23:59:59.0")) : delete this.end_date;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}

class CreateCustomerMeasurement {
	category_id: string;
	measurement_id: string;
	measurement: string;
	measurement_2: string;

	constructor(data: any) {
		this.category_id = data.category_id;
		this.measurement_id = data.measurement_id;
		this.measurement = data.measurement;
		this.measurement_2 = data.measurement_2;
	}
}

class CreateOrderProductDTO {
	order_id: string;
	category_id: string;
	worker_id?: string;
	parent?: number;
	qty: number;
	price: number;
	work_price?: number;
	work_total?: number;
	assign_date?: Date;

	constructor(data: any) {
		this.order_id = data.order_id;
		this.category_id = data.category_id;
		data.worker_id != undefined ? (this.worker_id = data.worker_id) : delete this.worker_id;
		data.parent != undefined ? (this.parent = data.parent) : delete this.parent;
		this.qty = data.qty;
		this.price = data.price;
		data.work_price != undefined ? (this.work_price = data.work_price) : delete this.work_price;
		data.work_total != undefined ? (this.work_total = data.work_total) : delete this.work_total;
		data.assign_date != undefined ? (this.assign_date = data.assign_date) : delete this.assign_date;
	}
}

export class CreateOrderDTO {
	total: number;
	order_date: Date;
	delivery_date: Date;
	shirt_pocket: number;
	pant_pocket: number;
	pant_pinch: number;
	type?: number;
	image_name: string;
	customer_id?: string;
	customer_name: string;
	customer_mobile: string;
	customer_address: string;
	customer_measurement: Array<CreateCustomerMeasurement> = [];
	order_details: Array<CreateOrderProductDTO> = [];

	constructor(data: any) {
		let parseData = JSON.parse(data.customer_measurement);
		let orderDetailsData = JSON.parse(data.order_details);
		this.total = data.total;
		this.order_date = data.order_date;
		this.delivery_date = data.delivery_date;
		this.shirt_pocket = data.shirt_pocket;
		this.pant_pocket = data.pant_pocket;
		this.pant_pinch = data.pant_pinch;
		data.type != undefined ? (this.type = data.type) : delete this.type;
		this.image_name = data.image_name;
		data.customer_id != undefined ? (this.customer_id = data.customer_id) : delete this.customer_id;
		this.customer_name = data.customer_name;
		this.customer_mobile = data.customer_mobile;
		this.customer_address = data.customer_address;
		parseData.forEach((customerMeasurement: CreateCustomerMeasurement) => {
			this.customer_measurement.push(new CreateCustomerMeasurement(customerMeasurement));
		});
		orderDetailsData.forEach((order_details: CreateOrderProductDTO) => {
			this.order_details.push(new CreateOrderProductDTO(order_details));
		});
	}
}
