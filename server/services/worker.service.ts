import { Op, Transaction } from "sequelize";
import { Category, Worker, WorkerPrice } from "../models";
import { CreateWorkerDTO, EditWorkerDTO } from "../dto";
import { executeTransaction, sequelizeConnection } from "../config/database";
import { includes } from "lodash";

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
			include: [
				{
					model: WorkerPrice,
					attributes: ["worker_price_id", "worker_id", "category_id", "price"],
					include: [{ model: Category, attributes: ["category_id", "category_name", "category_image"], required: false }],
					required: false,
				},
			],
			order: [["worker_name", "ASC"]],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
			distinct: true,
		});
	};

	public findAll = async () => {
		return await Worker.findAll({
			attributes: ["worker_id", "worker_name", "worker_mobile", "worker_address"],
			raw: true,
		});
	};

	public findOne = async (searchObject: any) => {
		return await Worker.findOne({
			where: {
				...searchObject,
			},
			attributes: ["worker_id", "worker_name", "worker_mobile", "worker_address", "worker_photo", "worker_proof"],
			include: [
				{
					model: WorkerPrice,
					attributes: ["worker_price_id", "worker_id", "category_id", "price"],
					include: [{ model: Category, attributes: ["category_id", "category_name", "category_image"] }],
				},
			],
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

	public delete = async (worker_id: string) => {
		return await Worker.destroy({ where: { worker_id: worker_id } }).then(() => {
			return "Worker Deleted successfully";
		});
	};
}
