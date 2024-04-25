import { Op } from "sequelize";
import { Worker, WorkerPayment } from "../models";
import { CreateWorkerPaymentDTO, EditWorkerPaymentDTO, SearchWorkerPaymentDTO } from "../dto";
import { sequelizeConnection } from "../config/database";

export default class WorkerPaymentService {
	private Sequelize = sequelizeConnection.Sequelize;
	public getAll = async (searchParams: SearchWorkerPaymentDTO) => {
		return await WorkerPayment.findAndCountAll({
			where: {
				...(searchParams.worker_id && { worker_id: searchParams.worker_id }),
				...(searchParams.start_date &&
					searchParams.end_date && {
						payment_date: {
							[Op.between]: [searchParams.start_date, searchParams.end_date],
						},
					}),
				type: 1,
			},
			include: [{ model: Worker, attributes: ["worker_name", "worker_mobile", "worker_address", "worker_photo"] }],
			attributes: [
				"worker_payment_id",
				"worker_id",
				[this.Sequelize.col("Worker.worker_name"), "worker_name"],
				[this.Sequelize.col("Worker.worker_mobile"), "worker_mobile"],
				[this.Sequelize.col("Worker.worker_address"), "worker_address"],
				"amount",
				"payment_date",
				"type",
			],
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

	public edit = async (workerPaymentData: EditWorkerPaymentDTO, worker_payment_id: number) => {
		return await WorkerPayment.update(workerPaymentData, { where: { worker_payment_id: worker_payment_id } }).then(() => {
			return "Worker Payment Data Edit successfully";
		});
	};
}
