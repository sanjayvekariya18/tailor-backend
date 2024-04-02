import { Transaction } from "sequelize";
import { logger } from "../../config";
import UserDetailsJSON from "./userDetails.json";
import { hashPassword } from "../../utils/bcrypt.helper";
import { Login } from "../../models";
import { LoginAttributes } from "../../models/login.model";

const userDetailsSeed = async (transaction: Transaction) => {
	// Check existing
	const dbUserDetailsData = await Login.findAll({ transaction, raw: true });
	const userDetailsData: any = UserDetailsJSON.filter((data) => dbUserDetailsData.findIndex((row) => row.user_name == data.user_name) < 0);

	const newUserData: Array<LoginAttributes> = [];
	for await (const data of userDetailsData) {
		newUserData.push({
			user_name: data.user_name,
			password: data.password,
			whatsapp_id: data.whatsapp_id,
			whatsapp_token: data.whatsapp_token,
		} as LoginAttributes);
	}

	// Bulk create permission
	if (newUserData.length > 0) {
		return await Login.bulkCreate(newUserData, { ignoreDuplicates: true, transaction, returning: true }).then((data) => {
			logger.info(`User Details seeder ran successfully. Total ${data.length} dummy user seeded`);
			return data;
		});
	}
};

export default userDetailsSeed;
