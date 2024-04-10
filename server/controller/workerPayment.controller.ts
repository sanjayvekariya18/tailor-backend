import { NextFunction, Request, Response } from "express";
import { isEmpty } from "../utils/helper";
import { WorkerPaymentService, WorkerService } from "../services";
import { WorkerPaymentValidation } from "../validations";
import { CreateWorkerPaymentDTO, EditWorkerPaymentDTO, SearchWorkerPaymentDTO } from "../dto";

export default class WorkerPaymentController {
	private workerPaymentService = new WorkerPaymentService();
	private workerServices = new WorkerService();
	private workerPaymentValidation = new WorkerPaymentValidation();

	public getAll = {
		validation: this.workerPaymentValidation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.workerPaymentService.getAll(new SearchWorkerPaymentDTO(req.query));
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.workerPaymentValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const workerPaymentData = new CreateWorkerPaymentDTO(req.body);
			const checkWorkerData = await this.workerServices.findOne({ worker_id: workerPaymentData.worker_id });
			if (checkWorkerData == null) {
				return res.api.badResponse({ message: "Worker Not Founds!" });
			}
			const data = await this.workerPaymentService.create(workerPaymentData);
			return res.api.create(data);
		},
	};

	public edit = {
		validation: this.workerPaymentValidation.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const worker_payment_id: string = req.params["worker_payment_id"] as string;
			const reqWorkerPaymentData = new EditWorkerPaymentDTO(req.body);
			const checkWorkerPaymentData = await this.workerPaymentService.findOne({ worker_payment_id: worker_payment_id });
			if (isEmpty(checkWorkerPaymentData)) {
				return res.api.badResponse({ message: "Payment Data Not Found" });
			}
			if (reqWorkerPaymentData.worker_id !== undefined) {
				const checkWorkerData = await this.workerServices.findOne({ worker_id: reqWorkerPaymentData.worker_id });
				if (checkWorkerData == null) {
					return res.api.badResponse({ message: "Worker Not Founds!" });
				}
			}
			const data = await this.workerPaymentService.edit(reqWorkerPaymentData, worker_payment_id);
			return res.api.create(data);
		},
	};
}
