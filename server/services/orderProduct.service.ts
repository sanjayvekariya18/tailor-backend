import { OrderProduct, WorkerPrice } from "../models";
import { SearchOrderProductDTO, createOrderProductDTO } from "../dto";
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

	public assignTask = async (orderProductData: createOrderProductDTO) => {
		await OrderProduct.create(orderProductData);
		return "OrderProduct Assign Successfully";
	};
}
