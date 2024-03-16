// import { NextFunction, Request, Response } from "express";
// import { Op } from "sequelize";
// import { isEmpty } from "../utils/helper";
// import { CategoryService, WorkerPriceService, WorkerService } from "../services";
// import { WorkerPriceValidation } from "../validations";
// import { CreateWorkerPriceDTO, SearchWorkerPriceDTO } from "../dto";

// export default class WorkerPriceController {
// 	private workerPriceService = new WorkerPriceService();
// 	private workerService = new WorkerService();
// 	private categoryService = new CategoryService();
// 	private workerPriceValidation = new WorkerPriceValidation();

// 	public getAll = {
// 		validation: this.workerPriceValidation.getAll,
// 		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
// 			const data = await this.workerPriceService.getAll(new SearchWorkerPriceDTO(req.query));
// 			return res.api.create(data);
// 		},
// 	};

// 	public create = {
// 		validation: this.workerPriceValidation.create,
// 		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
// 			const workerPriceData = new CreateWorkerPriceDTO(req.body);
// 			// const checkWorkerData = await this.workerService.findOne({ worker_id: workerPriceData.worker_id });
// 			// if (checkWorkerData == null) {
// 			// 	return res.api.badResponse({ message: "Worker Not Found" });
// 			// }
// 			// const checkCategoryData = await this.categoryService.findOne({ category_id: workerPriceData.category_id });
// 			// if (checkCategoryData == null) {
// 			// 	return res.api.badResponse({ message: "Category Not Found" });
// 			// }
// 			const checkWorkerPriceData = await this.workerPriceService.findOne({
// 				worker_id: workerPriceData.worker_id,
// 				category_id: workerPriceData.category_id,
// 			});
// 			if (!isEmpty(checkWorkerPriceData)) {
// 				return res.api.badResponse({ message: "Worker Price Already Exit" });
// 			}
// 			const data = await this.workerPriceService.create(workerPriceData);
// 			return res.api.create(data);
// 		},
// 	};

// 	// public edit = {
// 	// 	validation: this.workerPriceValidation.create,
// 	// 	controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
// 	// 		const categoryId: string = req.params["worker_price_id"] as string;
// 	// 		const reqCategoryData = new EditCategoryDTO(req.body);
// 	// 		const checkCategoryDataId = await this.workerPriceService.findOne({ category_id: categoryId });
// 	// 		if (isEmpty(checkCategoryDataId)) {
// 	// 			return res.api.badResponse({ message: "Category Data Not Found" });
// 	// 		}

// 	// 		const checkCategoryData = await this.workerPriceService.findOne({ category_name: reqCategoryData.category_name });
// 	// 		if (!isEmpty(checkCategoryData)) {
// 	// 			return res.api.badResponse({ message: "Category Name Already Exit" });
// 	// 		}
// 	// 		const data = await this.workerPriceService.edit(reqCategoryData, categoryId);
// 	// 		return res.api.create(data);
// 	// 	},
// 	// };
// }
