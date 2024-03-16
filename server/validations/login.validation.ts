export default class LoginValidation {
	public create = {
		user_name: "required|string",
		password: "required|string",
		whatsapp_id: "required|string",
		whatsapp_token: "required|string",
	};
}
