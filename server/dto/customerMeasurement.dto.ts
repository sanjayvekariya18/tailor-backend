export class CustomerMeasurementDTO {
	customer_id: number;
	category_id: number;
	measurement_id: number;
	measurement: string;
	measurement_2: string;

	constructor(data: any) {
		this.customer_id = data.customer_id;
		this.category_id = data.category_id;
		this.measurement_id = data.measurement_id;
		this.measurement = data.measurement ? data.measurement : "";
		this.measurement_2 = data.measurement_2 ? data.measurement_2 : "";
	}
}

export class BulkCustomerMeasurementDTO {
	customer_id: number;
	measurement: Array<CustomerMeasurementDTO>;

	constructor(data: any) {
		this.customer_id = data.customer_id;
		this.measurement = data.measurement.map((row: any) => new CustomerMeasurementDTO({ ...row, customer_id: data.customer_id }));
	}
}
