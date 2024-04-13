import { Transaction } from "sequelize";
import { executeTransaction, sequelizeConnection } from "../../config/database";
import logger from "../../config/logger";
import initSchemaRelationship from "../../InitialDBSetup/initSchemaRelationship";
import ChestDetailsSeed from "./chestDetails.seed";
import UserDetailsSeed from "./userDetails.seed";
import categorySeed from "./category.seed";
import measurementSeed from "./measurement.seed";

class DataSeed {
	static async run() {
		await sequelizeConnection
			.authenticate()
			.then(async () => {
				logger.info(`Database Connected`);
			})
			.catch((error) => {
				logger.error(`Unable to connect to the database: ${error}`);
			});

		await executeTransaction(async (transaction: Transaction) => {
			initSchemaRelationship();
			try {
				await ChestDetailsSeed(transaction);
				await UserDetailsSeed(transaction);
				await categorySeed(transaction);
				await measurementSeed(transaction);
			} catch (error) {
				transaction.rollback();
				logger.error(`Error occurred in seeder : ${error}`);
			}
		});
	}
}

DataSeed.run();
