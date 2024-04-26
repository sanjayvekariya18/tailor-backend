export class SearchDeliveryDTO {
	delivery_id?: number;
	order_id?: number;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.delivery_id != undefined ? (this.delivery_id = data.delivery_id) : delete this.delivery_id;
		data.order_id != undefined ? (this.order_id = data.order_id) : delete this.order_id;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}
export class CreateDeliveryDetailsDTO {
	delivery_id: number;
	category_id: number;
	qty: number;
	constructor(data: any) {
		this.delivery_id = 0;
		this.category_id = data.category_id;
		this.qty = data.qty;
	}
}

export class CreateDeliveryDTO {
	order_id: number;
	date: Date;
	delivered_to: string;
	delivered_mo?: string;
	total_delivered: number;
	note: string;
	delivery_details: Array<CreateDeliveryDetailsDTO> = [];
	constructor(data: any) {
		this.order_id = data.order_id;
		this.date = data.date;
		this.delivered_to = data.delivered_to;
		data.delivered_mo != undefined ? (this.delivered_mo = data.delivered_mo) : delete this.delivered_mo;
		this.note = data.note;
		data.delivery_details.forEach((row: any) => {
			if (row.qty > 0) {
				this.delivery_details.push(new CreateDeliveryDetailsDTO(row));
			}
		});
		this.total_delivered = this.delivery_details.reduce((a, b) => a + b.qty, 0);
	}
}

export class EditDeliveryDTO {
	date?: Date;
	delivered_to?: string;
	delivered_mo?: string;
	total_delivered?: number;
	note?: string;
	delivery_details: Array<CreateDeliveryDetailsDTO> = [];
	constructor(data: any) {
		data.date != undefined ? (this.date = data.date) : delete this.date;
		data.delivered_to != undefined ? (this.delivered_to = data.delivered_to.trim()) : delete this.delivered_to;
		data.delivered_mo != undefined ? (this.delivered_mo = data.delivered_mo.trim()) : delete this.delivered_mo;
		data.note != undefined ? (this.note = data.note.trim()) : delete this.note;
		data.delivery_details.forEach((row: any) => {
			if (row.qty > 0) {
				this.delivery_details.push(new CreateDeliveryDetailsDTO(row));
			}
		});
		this.total_delivered = this.delivery_details.reduce((a, b) => a + b.qty, 0);
	}
}
