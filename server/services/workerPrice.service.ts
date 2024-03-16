// import { Op } from "sequelize";
// import { Category, Measurement, WorkerPrice } from "../models";
// import { sequelizeConnection } from "../config/database";

// export default class WorkerPriceService {
// 	public getAll = async (searchParams: SearchWorkerPriceDTO) => {
// 		return await Measurement.findAll({
// 			where: {
// 				...(searchParams.worker_id && { worker_id: searchParams.worker_id }),
// 				...(searchParams.category_id && { category_id: searchParams.category_id }),
// 			},
// 			attributes: ["worker_price_id", "worker_id", "category_id", "price"],
// 			offset: searchParams.rowsPerPage * searchParams.page,
// 			limit: searchParams.rowsPerPage,
// 		});
// 	};

// 	public findOne = async (searchObject: any) => {
// 		return await Measurement.findOne({
// 			where: {
// 				...searchObject,
// 			},
// 			attributes: ["worker_price_id", "worker_id", "category_id", "price"],
// 			raw: true,
// 		});
// 	};

// 	public create = async (workerPriceData: CreateWorkerPriceDTO) => {
// 		return await WorkerPrice.create(workerPriceData).then(() => {
// 			return "Worker Price Added successfully";
// 		});
// 	};

// 	public edit = async (workerPriceData: CreateWorkerPriceDTO, worker_price_id: string) => {
// 		return await WorkerPrice.update(workerPriceData, { where: { worker_price_id: worker_price_id } }).then(() => {
// 			return "Worker Price Edited successfully";
// 		});
// 	};
// }
