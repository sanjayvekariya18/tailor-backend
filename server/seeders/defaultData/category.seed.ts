import { Transaction } from "sequelize";
import logger from "../../config/logger";
import Category, { CategoryAttributes } from "../../models/category.model";
import CategoryJson from "./category.json";

const categorySeed = async (transaction: Transaction) => {
	let tableData: Array<CategoryAttributes> = CategoryJson.map((data) => {
		return {
			category_name: data.category_name,
			category_type: data.category_type,
			category_image: data.category_image,
			is_active: data.is_active,
		} as CategoryAttributes;
	});

	const categoryData = await Category.findAll({ raw: true, transaction });
	tableData = tableData.filter(
		(newData) => categoryData.findIndex((data) => data.category_name.toLowerCase() == newData.category_name.toLowerCase()) < 0
	);

	return await Category.bulkCreate(tableData, { ignoreDuplicates: true, transaction, returning: true }).then(async (data) => {
		logger.info(`Category seeder ran successfully. Total ${data.length} Category seeded`);
		return data;
	});
};

export default categorySeed;
