import UserMasterService from "./user.service";

export interface PermissionDetails {
	name: string;
	view: boolean;
	create: boolean;
	edit: boolean;
	delete: boolean;
}

export interface LoggedInUserDetails {
	id: string;
	userName: string;
}

export interface LoggedInUserTokenPayload {
	user: LoggedInUserDetails;
	expires: number;
}

export default class AuthorizationService {
	private userMasterServices = new UserMasterService();
	public findUserById = async (loginId: string) => {
		return await this.userMasterServices.findOne({ login_id: loginId });
		// return {
		// 	id: userData?.login_id || "",
		// 	userName: userData?.user_name || "",
		// };
	};
}
