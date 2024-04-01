export class SearchWorkerPaymentDTO {
	worker_id?: string;

	constructor(data: any) {
		data.worker_id != undefined ? (this.worker_id = data.worker_id) : delete this.worker_id;
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
