export class SearchPurchaseDTO {
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

export class createPurchaseDTO {
	party_name: string;
	amount: number;
	payment?: number;
	outstand: number;
	details?: string;
	challan?: string;
	purchase_date: Date;
	constructor(data: any) {
		this.party_name = data.party_name;
		this.amount = data.amount;
		data.payment != undefined ? (this.payment = data.payment) : delete this.payment;
		this.outstand = data.outstand;
		data.details != undefined ? (this.details = data.details) : delete this.details;
		data.challan != undefined ? (this.challan = data.challan) : delete this.challan;
		this.purchase_date = data.purchase_date;
	}
}
export class EditPurchaseDTO {
	party_name?: string;
	amount?: number;
	payment?: number;
	outstand?: number;
	details?: string;
	challan?: string;
	purchase_date?: Date;
	constructor(data: any) {
		data.party_name != undefined ? (this.party_name = data.party_name) : delete this.party_name;
		data.amount != undefined ? (this.amount = data.amount) : delete this.amount;
		data.outstand != undefined ? (this.outstand = data.outstand) : delete this.outstand;
		data.details != undefined ? (this.details = data.details) : delete this.details;
		data.challan != undefined ? (this.challan = data.challan) : delete this.challan;
		data.purchase_date != undefined ? (this.purchase_date = data.purchase_date) : delete this.purchase_date;
	}
}
