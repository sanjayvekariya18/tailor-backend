import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { fileType, isEmpty, removeFile, saveFile } from "../utils/helper";
import { CategoryService, WorkerService } from "../services";
import { WorkerValidation } from "../validations";
import { CreateWorkerDTO, EditWorkerDTO, SearchWorkerDTO, WorkerAssignTaskDTO } from "../dto";
import { image } from "../constants";
import { BadResponseHandler } from "../errorHandler";

export default class WorkerController {
	private workerService = new WorkerService();
	private categoryService = new CategoryService();
	private workerValidation = new WorkerValidation();

	public getAll = {
		validation: this.workerValidation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.workerService.getAll(new SearchWorkerDTO(req.query));
			return res.api.create(data);
		},
	};

	public worker_assign_task = {
		validation: this.workerValidation.work_assign_task,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.workerService.worker_assign_task(new WorkerAssignTaskDTO(req.query));
			return res.api.create(data);
		},
	};

	public getWorkerList = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.workerService.findAll();
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.workerValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const workerData = new CreateWorkerDTO(req.body);
			const checkWorkerMobile = await this.workerService.findOne({ worker_mobile: workerData.worker_mobile });
			if (!isEmpty(checkWorkerMobile)) {
				return res.api.badResponse({ message: "Worker MobileNo Already Exit" });
			}
			const file: any = req.files;
			if (file) {
				if (file.worker_photo) {
					let fileValidation = fileType(file.worker_photo, image);
					if (fileValidation === false) {
						return res.api.validationErrors({
							message: ["Invalid profile file"],
						});
					}
					let file_path: any = await saveFile(file.worker_photo, "WorkerProfile");
					workerData.worker_photo = file_path.upload_path;
				}

				if (file.worker_proof) {
					let fileValidation = fileType(file.worker_proof, image);
					if (fileValidation === false) {
						return res.api.validationErrors({
							message: ["Invalid profile file"],
						});
					}
					let file_path: any = await saveFile(file.worker_proof, "WorkerProof");
					workerData.worker_proof = file_path.upload_path;
				}
			}

			const allCategory: any = [];
			await this.categoryService.findAll().then((data) => {
				data.map((categoryId) => {
					allCategory.push(categoryId.category_id);
				});
			});
			workerData.worker_price.map((data) => {
				if (!allCategory.includes(data.category_id)) {
					throw new BadResponseHandler("Category Not Found");
				}
			});
			await this.workerService.create(workerData);
			return res.api.create("worker Created Successfully");
		},
	};

	public edit = {
		validation: this.workerValidation.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const workerID: string = req.params["worker_id"] as string;

			const reqWorkerData = new EditWorkerDTO(req.body);
			const checkWorkerDataId = await this.workerService.findOne({ worker_id: workerID });
			if (checkWorkerDataId == null) {
				return res.api.badResponse({ message: "Worker Data Not Found" });
			}
			if (!isEmpty(reqWorkerData.worker_mobile)) {
				const checkWorkerMobile = await this.workerService.findOne({ worker_id: { [Op.not]: workerID }, worker_mobile: reqWorkerData.worker_mobile });
				if (!isEmpty(checkWorkerMobile)) {
					return res.api.badResponse({ message: "Worker MobileNo Already Exit" });
				}
			}

			const file: any = req.files;
			if (file) {
				if (file.worker_photo) {
					let fileValidation = fileType(file.worker_photo, image);
					if (fileValidation === false) {
						return res.api.validationErrors({
							message: ["Invalid profile file"],
						});
					}
					// Remove old image
					await removeFile(checkWorkerDataId?.worker_photo);
					// Upload new image
					let file_path: any = await saveFile(file.worker_photo, "WorkerProfile");
					reqWorkerData.worker_photo = file_path.upload_path;
				}

				if (file.worker_proof) {
					let fileValidation = fileType(file.worker_proof, image);
					if (fileValidation === false) {
						return res.api.validationErrors({
							message: ["Invalid profile file"],
						});
					}
					// Remove old image
					await removeFile(checkWorkerDataId?.worker_proof);
					// Upload new image
					let file_path: any = await saveFile(file.worker_proof, "WorkerProof");
					reqWorkerData.worker_proof = file_path.upload_path;
				}
			}
			const allCategory: any = [];
			await this.categoryService.findAll().then((data) => {
				data.map((categoryId) => {
					allCategory.push(categoryId.category_id);
				});
			});
			reqWorkerData.worker_price.map((data) => {
				if (!allCategory.includes(data.category_id)) {
					throw new BadResponseHandler("CateGory Not Found");
				}
			});
			const data = await this.workerService.edit(reqWorkerData, workerID);
			return res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const workerId: string = req.params["worker_id"] as string;
			const checkWorkerDataId = await this.categoryService.findOne({ category_id: workerId });
			if (checkWorkerDataId == null) {
				return res.api.badResponse({ message: "Worker Data Not Found" });
			}
			let data = this.workerService.delete(workerId);
			return res.api.create(data);
		},
	};
}
