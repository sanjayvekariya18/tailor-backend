import { Transaction } from "sequelize";
import { CreateDeliveryDTO, EditDeliveryDTO } from "../dto";
import { Category, Delivery, DeliveryDetails, OrderProduct } from "../models";
import { DeliveryDetailsAttributes } from "../models/deliveryDetails.model";
import { executeTransaction } from "../config/database";
import { WORKER_ASSIGN_TASK } from "../constants";

export default class DeliveryService {
	public getAll = async (searchParams: any) => {
		return await Delivery.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					delivery_id: searchParams.delivery_id,
				}),
			},
			attributes: ["delivery_id", "date", "delivery_to", "delivery_mo", "total_delivered", "note"],
			order: [["date", "ASC"]],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public findOne = async (searchObject: any) => {
		return await Delivery.findOne({
			where: {
				...searchObject,
			},
			attributes: ["delivery_id", "date", "delivery_to", "delivery_mo", "total_delivered", "note"],
			raw: true,
		});
	};

	public create = async (deliveryData: CreateDeliveryDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await Delivery.create(deliveryData, { transaction }).then(async (data) => {
				deliveryData.delivery_details.forEach((delivery_data) => {
					delivery_data.delivery_id = data.delivery_id;
				});
				return await DeliveryDetails.bulkCreate(deliveryData.delivery_details, { transaction }).then(() => {
					return "Order delivered to successfully";
				});
			});
		});
	};

	public edit = async (deliveryData: EditDeliveryDTO, delivery_id: string) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await Delivery.update(deliveryData, { where: { delivery_id: delivery_id }, transaction }).then(async () => {
				await DeliveryDetails.destroy({ where: { delivery_id: delivery_id }, transaction });
				let deliveryDetailsBulkData: Array<DeliveryDetailsAttributes> = [];
				deliveryData.delivery_details.map((delivery_data) => {
					deliveryDetailsBulkData.push({
						delivery_id: delivery_id,
						category_id: delivery_data.category_id,
						qty: delivery_data.qty,
					});
				});
				return await DeliveryDetails.bulkCreate(deliveryData.delivery_details, { transaction }).then(() => {
					return "Delivery data edit successfully";
				});
			});
		});
	};
	public findAllCompletedTask = async (order_id: string) => {
		return await OrderProduct.findAll({
			where: { status: WORKER_ASSIGN_TASK.complete, order_id: order_id },
			attributes: [
				" order_product_id",
				"order_id",
				"category_id",
				"worker_id",
				"parent",
				"qty",
				"price",
				"status",
				"work_price",
				"work_total",
				"assign_date",
			],
			include: [{ model: Category }],
		});
	};
}
