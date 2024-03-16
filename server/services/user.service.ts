import { Login } from "../models";

export default class UserService {
	public findOne = async (searchObject: any) => {
		return await Login.findOne({
			where: {
				...searchObject,
			},
			attributes: ["login_id", "user_name", "password", "whatsapp_id", "whatsapp_token"],
			raw: true,
		});
	};
}
