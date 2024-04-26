export class LoginDTO {
	user_name: string;
	password: string;
	address: string;
	mobile_no: string;
	logo: string;
	whatsapp_id: string;
	whatsapp_token: string;

	constructor(data: any) {
		this.user_name = data.user_name.trim();
		this.password = data.password.trim();
		this.address = data.address.trim();
		this.mobile_no = data.mobile_no.trim();
		this.logo = data.logo;
		this.whatsapp_id = data.whatsapp_id;
		this.whatsapp_token = data.whatsapp_token;
	}
}

export class EditUserDTO {
	user_name?: string;
	address?: string;
	mobile_no?: string;
	logo?: string;
	whatsapp_id?: string;
	whatsapp_token?: string;

	constructor(data: any) {
		data.user_name != undefined ? (this.user_name = data.user_name.trim()) : delete this.user_name;
		data.address != undefined ? (this.address = data.address.trim()) : delete this.address;
		data.mobile_no != undefined ? (this.mobile_no = data.mobile_no.trim()) : delete this.mobile_no;
		data.logo != undefined ? (this.logo = data.logo) : delete this.logo;
		data.whatsapp_id != undefined ? (this.whatsapp_id = data.whatsapp_id) : delete this.whatsapp_id;
		data.whatsapp_token != undefined ? (this.whatsapp_token = data.whatsapp_token) : delete this.whatsapp_token;
	}
}
