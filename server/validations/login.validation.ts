export default class LoginValidation {
	public create = {
		user_name: "required|string",
		password: "required|string",
		address: "required|string",
		mobile_no: "required|string",
		whatsapp_id: "required|string",
		whatsapp_token: "required|string",
	};
	public edit = {
		user_name: "string",
		password: "string",
		address: "string",
		mobile_no: "string",
		whatsapp_id: "string",
		whatsapp_token: "string",
	};
}
