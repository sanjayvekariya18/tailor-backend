import { sequelizeConnection } from "../config/database";
import logger from "../config/logger";
import initSchemaRelationship from "./initSchemaRelationship";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const testDBConnections = async () => {
	const maxAttempts = 5;
	const delayMs = 3000;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			await sequelizeConnection.authenticate();
			logger.info(`DB Connected`);
			initSchemaRelationship();
			return;
		} catch (error) {
			logger.error(`Unable to connect to the database (attempt ${attempt}/${maxAttempts}): ${error}`);
			if (attempt < maxAttempts) {
				await sleep(delayMs);
			}
		}
	}
};

export default testDBConnections;
