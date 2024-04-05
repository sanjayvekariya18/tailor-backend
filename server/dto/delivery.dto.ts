export class SearchDeliveryDTO {
	delivery_id?: string;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.delivery_id != undefined ? (this.delivery_id = data.delivery_id) : delete this.delivery_id;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}
export class CreateDeliveryDetailsDTO {
	delivery_id: string;
	category_id: string;
	qty: number;
	constructor(data: any) {
		this.delivery_id = "";
		this.category_id = data.category_id;
		this.qty = data.qty;
	}
}

export class CreateDeliveryDTO {
	date: Date;
	delivered_to: string;
	delivered_mo?: string;
	total_delivered: number;
	note: string;
	delivery_details: Array<CreateDeliveryDetailsDTO> = [];
	constructor(data: any) {
		this.date = data.date;
		this.delivered_to = data.delivered_to;
		data.delivered_mo != undefined ? (this.delivered_mo = data.delivered_mo) : delete this.delivered_mo;
		this.note = data.note;
		this.delivery_details.forEach((deliveryDetails: CreateDeliveryDetailsDTO) => {
			this.delivery_details.push(new CreateDeliveryDetailsDTO(deliveryDetails));
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
		data.delivered_to != undefined ? (this.delivered_to = data.delivered_to) : delete this.delivered_to;
		data.delivered_mo != undefined ? (this.delivered_mo = data.delivered_mo) : delete this.delivered_mo;
		data.total_delivered != undefined ? (this.total_delivered = data.total_delivered) : delete this.total_delivered;
		data.note != undefined ? (this.note = data.note) : delete this.note;
		this.delivery_details.forEach((deliveryDetails: CreateDeliveryDetailsDTO) => {
			this.delivery_details.push(new CreateDeliveryDetailsDTO(deliveryDetails));
		});
	}
}
