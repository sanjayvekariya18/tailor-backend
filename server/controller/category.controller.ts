import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { fileType, isEmpty, removeFile, saveFile } from "../utils/helper";
import { CategoryService } from "../services";
import { CategoryValidation } from "../validations";
import { CreateCategoryDTO, EditCategoryDTO, SearchCategoryDTO } from "../dto";
import { image } from "../constants";

export default class CategoryController {
	private categoryService = new CategoryService();
	private categoryValidation = new CategoryValidation();

	public getAll = {
		validation: this.categoryValidation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.categoryService.getAll(new SearchCategoryDTO(req.query));
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.categoryValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const categoryData = new CreateCategoryDTO(req.body);
			const checkCategoryData = await this.categoryService.findOne({ category_name: categoryData.category_name });
			if (!isEmpty(checkCategoryData)) {
				return res.api.badResponse({ message: "Category Name Already Exit" });
			}
			const file: any = req.files;
			if (file.category_image) {
				let fileValidation = fileType(file.category_image, image);
				if (fileValidation === false) {
					return res.api.validationErrors({
						message: ["Invalid Category Image file"],
					});
				}
				let file_path: any = await saveFile(file.category_image, "CategoryImage");
				categoryData.category_image = file_path.upload_path;
			}
			const data = await this.categoryService.create(categoryData);
			return res.api.create(data);
		},
	};

	public getCategory_list = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.categoryService.category_list();
			return res.api.create(data);
		},
	};

	public getCategoryList = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const sorted: boolean = typeof req.query["sorted"] != "undefined";
			const data = await this.categoryService.getList(sorted);
			return res.api.create(data);
		},
	};
	public edit = {
		validation: this.categoryValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const categoryId: string = req.params["category_id"] as string;
			const reqCategoryData = new EditCategoryDTO(req.body);
			const checkCategoryDataId = await this.categoryService.findOne({ category_id: categoryId });
			if (checkCategoryDataId == null) {
				return res.api.badResponse({ message: "Category Data Not Found" });
			}

			const checkCategoryData = await this.categoryService.findOne({
				category_id: { [Op.not]: categoryId },
				category_name: reqCategoryData.category_name,
			});
			if (!isEmpty(checkCategoryData)) {
				return res.api.badResponse({ message: "Category Name Already Exit" });
			}

			const file: any = req.files;
			if (file) {
				if (file.category_image) {
					let fileValidation = fileType(file.category_image, image);
					if (fileValidation === false) {
						return res.api.validationErrors({
							message: ["Invalid profile file"],
						});
					}
					// Remove old image
					await removeFile(checkCategoryDataId?.category_image);
					// Upload new image
					let file_path: any = await saveFile(file.category_image, "WorkerProfile");
					reqCategoryData.category_image = file_path.upload_path;
				}
			}
			const data = await this.categoryService.edit(reqCategoryData, categoryId);
			return res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const categoryId: string = req.params["category_id"] as string;
			const checkCategoryDataId = await this.categoryService.findOne({ category_id: categoryId });
			if (checkCategoryDataId == null) {
				return res.api.badResponse({ message: "Category Data Not Found" });
			}
			let data = this.categoryService.delete(categoryId);
			return res.api.create(data);
		},
	};
}
