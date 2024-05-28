export class SearchWorkerPaymentDTO {
	worker_id?: number;
	start_date?: Date;
	end_date?: Date;
	type?: number;
	page: number;
	rowsPerPage: number;
	constructor(data: any) {
		data.worker_id != undefined ? (this.worker_id = data.worker_id) : delete this.worker_id;
		data.start_date != undefined && data.start_date != "" ? (this.start_date = data.start_date) : delete this.start_date;
		data.end_date != undefined && data.end_date != "" ? (this.end_date = new Date(data.end_date + " 23:59:59.0")) : delete this.end_date;
		data.type != undefined && data.type != "" ? (this.type = data.type) : delete this.type;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}

export class CreateWorkerPaymentDTO {
	worker_id: number;
	amount: number;
	payment_date: Date;
	type: number;
	constructor(data: any) {
		this.worker_id = data.worker_id;
		this.amount = data.amount;
		this.payment_date = data.payment_date;
		this.type = 1;
	}
}

export class EditWorkerPaymentDTO {
	worker_id?: number;
	amount?: number;
	payment_date?: Date;
	type: number;
	constructor(data: any) {
		data.worker_id != undefined ? (this.worker_id = data.worker_id) : delete this.worker_id;
		data.amount != undefined ? (this.amount = data.amount) : delete this.amount;
		data.payment_date != undefined ? (this.payment_date = data.payment_date) : delete this.payment_date;
		this.type = 1;
	}
}
