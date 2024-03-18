import { OrderProduct } from "../models";
import { SearchOrderProductDTO, assignTask, createOrderProductDTO } from "../dto";
import { Transaction } from "sequelize";
import { executeTransaction } from "../config/database";

export default class OrderProductService {
	public getAll = async (searchParams: SearchOrderProductDTO) => {
		return await OrderProduct.findAndCountAll({
			where: {
				...(searchParams.worker_id && { worker_id: searchParams.worker_id }),
				...(searchParams.assign_date && { assign_date: searchParams.assign_date }),
			},
			attributes: ["order_product_id", "order_id", "category_id", "worker_id", "parent", "qty", "price", "work_price", "work_total", "assign_date"],
			order: [["assign_date", "ASC"]],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public findOne = async (searchObject: any) => {
		return await OrderProduct.findOne({
			where: {
				...searchObject,
			},
			attributes: ["order_product_id", "order_id", "category_id", "worker_id", "parent", "qty", "price", "work_price", "work_total", "assign_date"],
			raw: true,
		});
	};

	public assignTask = async (workerTask: assignTask, orderProductData: createOrderProductDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			await OrderProduct.update(workerTask, { where: { order_id: workerTask.order_id }, transaction });
			await OrderProduct.create(orderProductData, { transaction });
			return "OrderProduct Assign Successfully";
		});
	};
}
