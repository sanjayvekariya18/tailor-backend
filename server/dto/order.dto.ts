export class SearchOrderDTO {
	searchTxt?: string;
	customer_id?: string;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.searchTxt != undefined ? (this.searchTxt = data.searchTxt) : delete this.searchTxt;
		data.customer_id != undefined ? (this.customer_id = data.customer_id) : delete this.customer_id;
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

export class CreateOrderDTO {
	total: number;
	order_date: Date;
	delivery_date: Date;
	shirt_pocket: number;
	pant_pocket: number;
	pant_pinch: number;
	type: number;
	image_name: string;
	customer_id?: string;
	customer_name: string;
	customer_mobile: string;
	customer_address: string;
	customer_measurement: Array<CreateCustomerMeasurement> = [];

	constructor(data: any) {
		let parseData = JSON.parse(data.customer_measurement);
		this.total = data.total;
		this.order_date = data.order_date;
		this.delivery_date = data.delivery_date;
		this.shirt_pocket = data.shirt_pocket;
		this.pant_pocket = data.pant_pocket;
		this.pant_pinch = data.pant_pinch;
		this.type = data.type;
		this.image_name = data.image_name;
		data.customer_id != undefined ? (this.customer_id = data.customer_id) : delete this.customer_id;
		this.customer_name = data.customer_name;
		this.customer_mobile = data.customer_mobile;
		this.customer_address = data.customer_address;
		parseData.forEach((customerMeasurement: CreateCustomerMeasurement) => {
			this.customer_measurement.push(new CreateCustomerMeasurement(customerMeasurement));
		});
	}
}
