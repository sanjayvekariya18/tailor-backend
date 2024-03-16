export class LoginDTO {
	user_name: string;
	password: string;
	whatsapp_id: string;
	whatsapp_token: string;

	constructor(data: any) {
		this.user_name = data.user_name;
		this.password = data.password;
		this.whatsapp_id = data.whatsapp_id;
		this.whatsapp_token = data.whatsapp_token;
	}
}
