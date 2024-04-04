import { Op } from "sequelize";
import { CreateCategoryDTO, EditCategoryDTO, SearchCategoryDTO } from "../dto";
import { Category } from "../models";

export default class CategoryService {
	public getAll = async (searchParams: SearchCategoryDTO) => {
		return await Category.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					category_name: { [Op.like]: "%" + searchParams.searchTxt + "%" },
				}),
				...(searchParams.category_type && {
					category_type: searchParams.category_type,
				}),
			},
			attributes: ["category_id", "category_name", "category_type", "category_image", "is_active"],
			order: [["category_name", "ASC"]],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public category_list = async () => {
		return await Category.findAll({
			where: { is_active: true },
			attributes: ["category_id", "category_name", "category_type", "category_image", "is_active"],
			raw: true,
		});
	};

	public findAll = async () => {
		return await Category.findAll({
			attributes: ["category_id", "category_name", "category_type", "category_image", "is_active"],
			raw: true,
		});
	};

	public getList = async (sorted: boolean = false) => {
		const data = await Category.findAll({
			attributes: ["category_id", "category_name", "category_type", "category_image", "is_active"],
			raw: true,
		});

		if (sorted) {
			const response_data: any = {};

			for (const category of data) {
				if (!response_data[`${category.category_type}`]) {
					response_data[`${category.category_type}`] = [];
				}
				response_data[`${category.category_type}`].push(category);
			}

			return response_data;
		} else {
			return data;
		}
	};

	public findOne = async (searchObject: any) => {
		return await Category.findOne({
			where: {
				...searchObject,
			},
			attributes: ["category_id", "category_name", "category_type", "category_image", "is_active"],
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
