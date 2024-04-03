import { NextFunction, Request, Response } from "express";
import { isEmpty } from "../utils/helper";
import { CategoryService, MeasurementService } from "../services";
import { MeasurementValidation } from "../validations";
import { CreateMeasurementDTO, SearchMeasurementDTO } from "../dto";
import { Op } from "sequelize";

export default class MeasurementController {
	private measurementService = new MeasurementService();
	private categoryService = new CategoryService();
	private measurementValidation = new MeasurementValidation();

	public getAll = {
		validation: this.measurementValidation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.measurementService.getAll(new SearchMeasurementDTO(req.query));
			return res.api.create(data);
		},
	};

	public findAll = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const categoryID: string = req.params["category_id"] as string;
			const getCategoryData = await this.measurementService.findAllCategoryData({ category_id: categoryID });
			if (isEmpty(getCategoryData)) {
				return res.api.badResponse({ message: "Measurement Data Not Found" });
			}
			return res.api.create(getCategoryData);
		},
	};

	public create = {
		validation: this.measurementValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const measurementData = new CreateMeasurementDTO(req.body);
			const checkCategoryData = await this.categoryService.findOne({ category_id: measurementData.category_id });
			const checkMeasurementName = await this.measurementService.findOne({
				measurement_name: measurementData.measurement_name,
				category_id: measurementData.category_id,
			});

			if (checkMeasurementName !== null) {
				return res.api.badResponse({ message: "Measurement Name Already Exits" });
			}

			if (isEmpty(checkCategoryData)) {
				return res.api.badResponse({ message: "Category Not Found" });
			}
			const data = await this.measurementService.create(measurementData);
			return res.api.create(data);
		},
	};

	public edit = {
		validation: this.measurementValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const measurementID: string = req.params["measurement_id"] as string;
			const reqMeasurementData = new CreateMeasurementDTO(req.body);
			const checkMeasurementDataId = await this.measurementService.findOne({ measurement_id: measurementID });
			if (isEmpty(checkMeasurementDataId)) {
				return res.api.badResponse({ message: "Measurement Data Not Found" });
			}
			const checkCategoryData = await this.categoryService.findOne({ category_id: reqMeasurementData.category_id });
			if (isEmpty(checkCategoryData)) {
				return res.api.badResponse({ message: "Category Not Found" });
			}

			const checkMeasurementName = await this.measurementService.findOne({
				measurement_name: reqMeasurementData.measurement_name,
				category_id: { [Op.in]: reqMeasurementData.category_id },
			});

			if (checkMeasurementName !== null) {
				return res.api.badResponse({ message: "Measurement Name Already Exits" });
			}

			const data = await this.measurementService.edit(reqMeasurementData, measurementID);
			return res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const measurementId: string = req.params["measurement_id"] as string;
			const measurementDataId = await this.measurementService.findOne({ measurement_id: measurementId });
			if (measurementDataId == null) {
				return res.api.badResponse({ message: "Measurement Data Not Found" });
			}
			let data = this.measurementService.delete(measurementId);
			return res.api.create(data);
		},
	};
}
