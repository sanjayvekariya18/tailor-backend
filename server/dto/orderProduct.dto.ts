export class SearchOrderProductDTO {
	assign_date?: Date;
	worker_id?: string;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.assign_date != undefined ? (this.assign_date = data.assign_date) : delete this.assign_date;
		data.worker_id != undefined ? (this.worker_id = data.worker_id) : delete this.worker_id;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}

export class assignTask {
	order_id: string;
	worker_id: string;
	qty: number;
	worker_price: number;
	work_total: number;
	constructor(data: any) {
		this.order_id = data.order_id;
		this.worker_id = data.worker_id;
		this.qty = data.qty;
		this.worker_price = data.worker_price;
		this.work_total = data.work_total;
	}
}

export class createOrderProductDTO {
	order_product_id?: string;
	order_id: string;
	category_id: string;
	worker_id: string;
	qty: number;
	price: number;
	work_price: number;
	work_total: number;
	assign_date: Date;
	constructor(data: any) {
		data.order_product_id != undefined ? (this.order_product_id = data.order_product_id) : delete this.order_product_id;
		this.order_id = data.order_id;
		this.category_id = data.category_id;
		this.worker_id = data.worker_id;
		this.qty = data.qty;
		this.price = data.price;
		this.work_price = data.work_price;
		this.work_total = data.work_total;
		this.assign_date = data.assign_date;
	}
}
