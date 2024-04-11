import { EditUserDTO, LoginDTO } from "../dto";
import { Login } from "../models";

export default class UserService {
	public getAll = async () => {
		return Login.findAll({
			attributes: ["login_id", "user_name", "password", "address", "mobile_no", "logo", "whatsapp_id", "whatsapp_token"],
			raw: true,
		});
	};

	public findOne = async (searchObject: any) => {
		return await Login.findOne({
			where: {
				...searchObject,
			},
			attributes: ["login_id", "user_name", "password", "address", "mobile_no", "logo", "whatsapp_id", "whatsapp_token"],
			raw: true,
		});
	};

	public create = async (userData: LoginDTO) => {
		await Login.create(userData);
		return "User added successfully";
	};

	public edit = async (user_id: string, userData: EditUserDTO) => {
		return await Login.update(userData, {
			where: { login_id: user_id },
		}).then(() => {
			return "User updated successfully";
		});
	};
}
