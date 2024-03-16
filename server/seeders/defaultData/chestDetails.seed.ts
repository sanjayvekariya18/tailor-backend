import { Transaction } from "sequelize";
import logger from "../../config/logger";
import { ChestDetails } from "../../models";
import { ChestDetailsAttributes } from "../../models/chestDetails.model";
import chestDetailsJson from "./chestDetails.json";

const chestDetailsSeed = async (transaction: Transaction) => {
	let tableData: Array<ChestDetailsAttributes> = chestDetailsJson.map((data) => {
		return {
			chest: data.chest,
			mudho_golai: data.mudho_golai,
			mudho: data.mudho,
			cross_bay: data.cross_by,
			ba_mudho_down: data.ba_mudho_down,
			so_down: data.so_down,
		} as ChestDetailsAttributes;
	});
	const userRoleData = (await ChestDetails.findAll({ transaction })).map((data) => data.chest);

	tableData = tableData.filter((rowData) => userRoleData.indexOf(rowData.chest || "") < 0);

	return await ChestDetails.bulkCreate(tableData, { ignoreDuplicates: true, transaction, returning: true }).then(async (data) => {
		logger.info(`Chest Details seeder ran successfully. Total ${data.length} Chest Details seeded`);
		return data;
	});
};

export default chestDetailsSeed;
