import { Op, Transaction } from "sequelize";
import { Worker, WorkerPrice } from "../models";
import { CreateWorkerDTO, EditWorkerDTO } from "../dto";
import { executeTransaction } from "../config/database";

export default class WorkerService {
	public getAll = async (searchParams: any) => {
		return await Worker.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					[Op.or]: [
						{
							worker_name: { [Op.like]: "%" + searchParams.searchTxt + "%" },
						},
						{
							worker_mobile: { [Op.like]: "%" + searchParams.searchTxt + "%" },
						},
					],
				}),
			},
			attributes: ["worker_id", "worker_name", "worker_mobile", "worker_address", "worker_photo", "worker_proof"],
			order: [["worker_name", "ASC"]],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public findOne = async (searchObject: any) => {
		return await Worker.findOne({
			where: {
				...searchObject,
			},
			attributes: ["worker_id", "worker_name", "worker_mobile", "worker_address", "worker_photo", "worker_proof"],
			raw: true,
		});
	};

	public create = async (workerData: CreateWorkerDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await Worker.create(workerData, { transaction }).then(async (data) => {
				let workerPriceBulkData: any = [];
				workerData.worker_price.map((Workerdata) => {
					return workerPriceBulkData.push({ worker_id: data.worker_id, category_id: Workerdata.category_id, price: Workerdata.price });
				});
				return await WorkerPrice.bulkCreate(workerPriceBulkData, { transaction });
			});
		});
	};

	public edit = async (workerData: EditWorkerDTO, Worker_id: string) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await Worker.update(workerData, { where: { worker_id: Worker_id }, transaction }).then(async () => {
				await WorkerPrice.destroy({ where: { worker_id: Worker_id }, transaction });
				let workerPriceBulkData: any = [];
				workerData.worker_price.map((Workerdata) => {
					return workerPriceBulkData.push({ worker_id: Worker_id, category_id: Workerdata.category_id, price: Workerdata.price });
				});
				return await WorkerPrice.bulkCreate(workerPriceBulkData, { transaction });
			});
		});
	};
}
