import { Transaction } from "sequelize";
import { Category } from "../../models";
import Measurement, { MeasurementAttributes } from "../../models/measurement.model";
import measurementJsonData from "./measurement.json";
import { logger } from "../../config";

const measurementSeed = async (transaction: Transaction) => {
	const categoryData = await Category.findAll({ transaction });

	let tableData: Array<MeasurementAttributes> = [];

	for (const data of measurementJsonData) {
		const categoryId = categoryData.find((row) => row.category_name == data.category_name);

		if (categoryId) {
			tableData.push({
				measurement_id: data.measurement_id,
				category_id: categoryId.category_id,
				measurement_name: data.measurement_name,
			});
		}
	}

	const measurementData = await Measurement.findAll({ raw: true, transaction });
	tableData = tableData.filter(
		(newData) => measurementData.findIndex((data) => data.category_id == newData.category_id && data.measurement_name == newData.measurement_name) < 0
	);

	return await Measurement.bulkCreate(tableData, { ignoreDuplicates: true, transaction, returning: true }).then((data) => {
		logger.info(`Measurement seeder ran successfully. Total ${data.length} CategoryAttributes seeded`);
		return data;
	});
};

export default measurementSeed;
