export class SearchCustomerDTO {
	searchTxt?: string;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.searchTxt != undefined ? (this.searchTxt = data.searchTxt) : delete this.searchTxt;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}

export class CreateCustomerDTO {
	customer_name: string;
	customer_mobile: string;
	customer_address: string;
	constructor(data: any) {
		this.customer_name = data.customer_name;
		this.customer_mobile = data.customer_mobile;
		this.customer_address = data.customer_address;
	}
}

export class EditCustomerDTO {
	customer_name?: string;
	customer_mobile?: string;
	customer_address?: string;
	constructor(data: any) {
		data.customer_name != undefined ? (this.customer_name = data.customer_name) : delete this.customer_name;
		data.customer_mobile != undefined ? (this.customer_mobile = data.customer_mobile) : delete this.customer_mobile;
		data.customer_address != undefined ? (this.customer_address = data.customer_address) : delete this.customer_address;
	}
}
export class ChangeCustomerPasswordDTO {
	old_password: string;
	new_password: string;
	confirm_password: string;
	constructor(data: any) {
		this.old_password = data.old_password;
		this.new_password = data.new_password;
		this.confirm_password = data.confirm_password;
	}
}
