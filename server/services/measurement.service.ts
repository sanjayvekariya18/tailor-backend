import { Op } from "sequelize";
import { CreateMeasurementDTO } from "../dto";
import { Category, Measurement } from "../models";
import { sequelizeConnection } from "../config/database";

export default class MeasurementService {
	public getAll = async (searchParams: any) => {
		return await Measurement.findAll({
			where: {
				...(searchParams.category_id && { category_id: searchParams.category_id }),
				...(searchParams.searchTxt && {
					measurement_name: { [Op.like]: "%" + searchParams.searchTxt + "%" },
				}),
			},
			attributes: [
				"measurement_id",
				"measurement_name",
				[sequelizeConnection.Sequelize.col("Category.category_id"), "category_id"],
				[sequelizeConnection.Sequelize.col("Category.category_name"), "category_name"],
			],
			include: [
				{
					model: Category,
					attributes: [],
				},
			],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public findOne = async (searchObject: any) => {
		return await Measurement.findOne({
			where: {
				...searchObject,
			},
			attributes: [
				"measurement_id",
				"measurement_name",
				[sequelizeConnection.Sequelize.col("Category.category_id"), "category_id"],
				[sequelizeConnection.Sequelize.col("Category.category_name"), "category_name"],
			],
			include: [
				{
					model: Category,
					attributes: [],
				},
			],
			raw: true,
		});
	};

	public findAllCategoryData = async (searchObject: any) => {
		return await Measurement.findOne({
			where: {
				...searchObject,
			},
			attributes: [
				"measurement_id",
				"measurement_name",
				[sequelizeConnection.Sequelize.col("Category.category_name"), "category_name"],
				[sequelizeConnection.Sequelize.col("Category.category_id"), "category_id"],
			],
			include: [
				{
					model: Category,
					attributes: [],
				},
			],
			raw: true,
		});
	};

	public findAll = async () => {
		return await Measurement.findAll({
			attributes: ["measurement_id", "measurement_name"],
			raw: true,
		});
	};
	public create = async (measurementData: CreateMeasurementDTO) => {
		return await Measurement.create(measurementData).then(() => {
			return "Measurement Added successfully";
		});
	};

	public edit = async (measurementData: CreateMeasurementDTO, measurement_id: string) => {
		return await Measurement.update(measurementData, { where: { measurement_id: measurement_id } }).then(() => {
			return "Measurement Edited successfully";
		});
	};

	public delete = async (measurement_id: string) => {
		return await Measurement.destroy({ where: { measurement_id: measurement_id } }).then(() => {
			return "Measurement Delete successfully";
		});
	};
}
