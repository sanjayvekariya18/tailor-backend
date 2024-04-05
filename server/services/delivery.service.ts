import { Transaction } from "sequelize";
import { CreateDeliveryDTO, EditDeliveryDTO } from "../dto";
import { Category, Delivery, DeliveryDetails, OrderProduct } from "../models";
import { DeliveryDetailsAttributes } from "../models/deliveryDetails.model";
import { executeTransaction, sequelizeConnection } from "../config/database";
import { WORKER_ASSIGN_TASK } from "../constants";

export default class DeliveryService {
	private Sequelize = sequelizeConnection.Sequelize;
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
		let data = await OrderProduct.findAll({
			where: { status: WORKER_ASSIGN_TASK.complete, order_id: order_id },
			attributes: [
				"order_product_id",
				"order_id",
				"category_id",
				[this.Sequelize.col("Category.category_name"), "category_name"],
				"qty",
				"price",
				"status",
			],
			include: [{ model: Category, attributes: [] }],
			raw: true,
		});
		const categoryWiseData: any = {};
		data.forEach((item) => {
			const key = `${item.order_id}_${item.category_id}`;
			if (categoryWiseData[key]) {
				categoryWiseData[key].qty += item.qty;
			} else {
				categoryWiseData[key] = { ...item };
			}
		});
		return Object.values(categoryWiseData).map((item: any) => ({
			order_product_id: item.order_product_id,
			order_id: item.order_id,
			category_id: item.category_id,
			category_name: item.category_name,
			qty: item.qty,
			price: item.price,
			status: item.status,
		}));
	};
}
