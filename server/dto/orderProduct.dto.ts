import { WORKER_ASSIGN_TASK } from "../constants";

export class SearchOrderProductDTO {
	assign_date?: Date;
	worker_id?: string;
	order_id?: string;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.assign_date != undefined && data.assign_date != "" ? (this.assign_date = data.assign_date) : delete this.assign_date;
		data.worker_id != undefined && data.worker_id != "" ? (this.worker_id = data.worker_id) : delete this.worker_id;
		data.order_id != undefined && data.order_id != "" ? (this.order_id = data.order_id) : delete this.order_id;
		this.page = data.page != undefined && data.page != "" ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined && data.rowsPerPage != "" ? Number(data.rowsPerPage) : 10;
	}
}

export class createOrderProductDTO {
	order_id: string;
	category_id: string;
	worker_id: string;
	qty: number;
	price?: number;
	work_price?: number;
	work_total?: number;
	status: WORKER_ASSIGN_TASK;
	assign_date: Date;
	constructor(data: any) {
		this.order_id = data.order_id;
		this.category_id = data.category_id;
		this.worker_id = data.worker_id;
		this.qty = data.qty;
		this.price = data.price != undefined && data.price != "" ? Number(data.price) : 0;
		this.status = WORKER_ASSIGN_TASK.assign;
		this.assign_date = data.assign_date;
	}
}
export class CreateOrderProductDTO {
	order_id: string;
	category_id: string;
	qty: number;
	price: number;

	constructor(data: any) {
		this.order_id = data.order_id;
		this.category_id = data.category_id;
		this.qty = data.qty;
		this.price = data.price;
	}
}

export class BulkCreatedDTO {
	assign_date: Date;
	worker_id: string;
	worker_task: Array<CreateOrderProductDTO>;
	constructor(data: any) {
		this.assign_date = new Date(data.assign_date);
		this.worker_id = data.worker_id;
		this.worker_task = data.worker_task.map((row: any) => new CreateOrderProductDTO(row));
	}
}

export class GetWorkerAssignTaskDTO {
	order_id: string;
	category_id: string;

	constructor(data: any) {
		this.order_id = data.order_id;
		this.category_id = data.category_id;
	}
}
