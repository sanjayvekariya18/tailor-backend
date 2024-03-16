export class SearchWorkerPaymentDTO {
	start_date?: Date;
	end_date?: Date;
	worker_id?: string;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.start_date != undefined ? (this.start_date = data.start_date) : delete this.start_date;
		data.end_date != undefined ? (this.end_date = new Date(data.end_date + " 23:59:59.0")) : delete this.end_date;
		data.worker_id != undefined ? (this.worker_id = data.worker_id) : delete this.worker_id;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}

export class CreateWorkerPaymentDTO {
	worker_id: string;
	amount: number;
	payment_date: Date;
	type: number;
	constructor(data: any) {
		this.worker_id = data.worker_id;
		this.amount = data.amount;
		this.payment_date = data.payment_date;
		this.type = data.type;
	}
}

export class EditWorkerPaymentDTO {
	worker_id?: string;
	amount?: number;
	payment_date?: Date;
	type?: number;
	constructor(data: any) {
		data.worker_id != undefined ? (this.worker_id = data.worker_id) : delete this.worker_id;
		data.amount != undefined ? (this.amount = data.amount) : delete this.amount;
		data.payment_date != undefined ? (this.payment_date = data.payment_date) : delete this.payment_date;
		data.type != undefined ? (this.type = data.type) : delete this.type;
	}
}
