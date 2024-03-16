import { Op } from "sequelize";
import { CreateCategoryDTO, EditCategoryDTO } from "../dto";
import { Category } from "../models";

export default class CategoryService {
	public getAll = async (searchParams: any) => {
		return await Category.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					category_name: { [Op.like]: "%" + searchParams.searchTxt + "%" },
				}),
			},
			attributes: ["category_id", "category_name", "category_image"],
			order: [["category_name", "ASC"]],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public findAll = async () => {
		return await Category.findAll({
			attributes: ["category_id", "category_name", "category_image"],
			raw: true,
		});
	};

	public findOne = async (searchObject: any) => {
		return await Category.findOne({
			where: {
				...searchObject,
			},
			attributes: ["category_id", "category_name", "category_image"],
			raw: true,
		});
	};

	public create = async (categoryData: CreateCategoryDTO) => {
		return await Category.create(categoryData).then(() => {
			return "Category Added successfully";
		});
	};

	public edit = async (categoryData: EditCategoryDTO, category_id: string) => {
		return await Category.update(categoryData, { where: { category_id: category_id } }).then(() => {
			return "Category Edited successfully";
		});
	};
	public delete = async (category_id: string) => {
		return await Category.destroy({ where: { category_id: category_id } }).then(() => {
			return "Category Deleted successfully";
		});
	};
}
