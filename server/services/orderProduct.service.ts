import { Category, OrderProduct, WorkerPrice } from "../models";
import { SearchOrderProductDTO, createOrderProductDTO } from "../dto";
import { sequelizeConnection } from "../config/database";
export default class OrderProductService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchOrderProductDTO) => {
		return await OrderProduct.findAndCountAll({
			where: {
				...(searchParams.worker_id && { worker_id: searchParams.worker_id }),
				...(searchParams.assign_date && { assign_date: searchParams.assign_date }),
				...(searchParams.order_id && { order_id: searchParams.order_id }),
			},
			include: [{ model: Category, attributes: [] }],
			attributes: [
				"order_product_id",
				"order_id",
				"category_id",
				[this.Sequelize.col("Category.category_name"), "category_name"],
				"worker_id",
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

	public assignTask = async (orderProductData: createOrderProductDTO) => {
		await OrderProduct.create(orderProductData);
		return "OrderProduct Assign Successfully";
	};
}
