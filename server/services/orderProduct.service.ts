import { Category, Customer, Order, OrderProduct, Worker, WorkerPayment } from "../models";
import { SearchOrderProductDTO, createOrderProductDTO } from "../dto";
import { executeTransaction, sequelizeConnection } from "../config/database";
import { Transaction } from "sequelize";
import { Op } from "sequelize";

export default class OrderProductService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchOrderProductDTO) => {
		return await OrderProduct.findAndCountAll({
			where: {
				...(searchParams.worker_id && { worker_id: searchParams.worker_id }),
				...(searchParams.assign_date && {
					assign_date: {
						[Op.and]: [
							this.Sequelize.literal(`DATE_FORMAT(assign_date, '%Y-%m-%d') BETWEEN '${searchParams.assign_date}' AND '${searchParams.assign_date}'`),
						],
					},
				}),
				...(searchParams.order_id && { order_id: searchParams.order_id }),
			},
			include: [
				{ model: Category, attributes: [] },
				{ model: Order, attributes: [], include: [{ model: Customer, attributes: ["customer_id", "customer_name", "customer_mobile"] }] },
				{ model: Worker, attributes: [] },
			],
			attributes: [
				"order_product_id",
				"order_id",
				"category_id",
				[this.Sequelize.col("Order.order_date"), "order_date"],
				[this.Sequelize.col("Category.category_name"), "category_name"],
				[this.Sequelize.col("Order.customer_id"), "customer_id"],
				[this.Sequelize.col("Order.Customer.customer_name"), "customer_name"],
				[this.Sequelize.col("Order.Customer.customer_mobile"), "customer_mobile"],
				"worker_id",
				[this.Sequelize.col("Worker.worker_name"), "worker_name"],
				[this.Sequelize.col("Worker.worker_mobile"), "worker_mobile"],
				"parent",
				"qty",
				"price",
				"status",
				"work_price",
				"work_total",
				"assign_date",
			],
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
			attributes: [
				"order_product_id",
				"order_id",
				"category_id",
				"worker_id",
				"parent",
				"qty",
				"status",
				"price",
				"work_price",
				"work_total",
				"assign_date",
			],
			raw: true,
		});
	};

	public assignTask = async (orderProductData: createOrderProductDTO, order_product_id: string, qty: number, workerPayment: any) => {
		return await executeTransaction(async (transaction: Transaction) => {
			await OrderProduct.create(orderProductData, { transaction });
			await OrderProduct.update({ qty: qty }, { where: { order_product_id: order_product_id }, transaction });
			await OrderProduct.destroy({ where: { qty: 0 }, transaction });
			await WorkerPayment.create(workerPayment, { transaction });
			return "OrderProduct Assign Successfully";
		});
	};
}
