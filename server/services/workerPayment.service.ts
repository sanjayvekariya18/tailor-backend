import { Op } from "sequelize";
import { WorkerPayment } from "../models";
import { CreateWorkerPaymentDTO, EditWorkerPaymentDTO } from "../dto";

export default class WorkerPaymentService {
	public getAll = async (searchParams: any) => {
		return await WorkerPayment.findAndCountAll({
			where: {
				...(searchParams.worker_id && { worker_id: searchParams.worker_id }),
				...(searchParams.start_date &&
					searchParams.end_date && {
						start_date: {
							[Op.between]: [searchParams.start_date, searchParams.end_date],
						},
					}),
			},
			attributes: ["worker_payment_id", "worker_id", "amount", "payment_date", "type"],
			order: [["payment_date", "ASC"]],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public findAll = async () => {
		return await WorkerPayment.findAll({
			attributes: ["worker_id", "amount", "payment_date", "type"],
			raw: true,
		});
	};

	public findOne = async (searchObject: any) => {
		return await WorkerPayment.findOne({
			where: {
				...searchObject,
			},
			attributes: ["worker_id", "amount", "payment_date", "type"],
			raw: true,
		});
	};

	public create = async (workerPaymentData: CreateWorkerPaymentDTO) => {
		return await WorkerPayment.create(workerPaymentData).then(() => {
			return "Worker payment Added successfully";
		});
	};

	public edit = async (workerPaymentData: EditWorkerPaymentDTO, worker_payment_id: string) => {
		return await WorkerPayment.update(workerPaymentData, { where: { worker_payment_id: worker_payment_id } }).then(() => {
			return "Worker Payment Data Edit successfully";
		});
	};
}
