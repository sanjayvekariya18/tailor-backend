import { QueryTypes, Transaction } from "sequelize";
import { CreateDeliveryDTO, EditDeliveryDTO, SearchDeliveryDTO } from "../dto";
import { Category, Delivery, DeliveryDetails } from "../models";
import { executeTransaction, sequelizeConnection } from "../config/database";
import { WORKER_ASSIGN_TASK } from "../constants";

export default class DeliveryService {
	public getAll = async (searchParams: SearchDeliveryDTO) => {
		return await Delivery.findAndCountAll({
			where: {
				...(searchParams.delivery_id && {
					delivery_id: searchParams.delivery_id,
				}),
				...(searchParams.order_id && {
					order_id: searchParams.order_id,
				}),
			},
			attributes: ["delivery_id", "order_id", "date", "delivered_to", "delivered_mo", "total_delivered", "note"],
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
			include: [
				{
					model: DeliveryDetails,
					include: [{ model: Category, attributes: ["category_name", "category_type", "category_image"] }],
				},
			],
			attributes: ["delivery_id", "order_id", "date", "delivered_to", "delivered_mo", "total_delivered", "note"],
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

	public edit = async (deliveryData: EditDeliveryDTO, delivery_id: number) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await Delivery.update(deliveryData, { where: { delivery_id: delivery_id }, transaction }).then(async () => {
				await DeliveryDetails.destroy({ where: { delivery_id: delivery_id }, transaction });
				deliveryData.delivery_details.forEach((delivery_data) => {
					delivery_data.delivery_id = delivery_id;
				});
				return await DeliveryDetails.bulkCreate(deliveryData.delivery_details, { transaction }).then(() => {
					return "Delivery data edit successfully";
				});
			});
		});
	};

	public findAllCompletedTask = async (order_id: number) => {
		return await sequelizeConnection.query(
			`
            select
                op.order_id,
                op.category_id,
                c.category_name,
                sum(op.qty) as qty,
                (
                select
                    coalesce ( sum(dd.qty),
                    0)
                from
                    delivery_details dd
                left join delivery d on
                    d.order_id = op.order_id
                where
                    dd.delivery_id = d.delivery_id
                    and dd.category_id = op.category_id
                )as delivered_qty
            from
                order_product op
            left join category c on
                c.category_id = op.category_id
            where
                op.order_id = ${order_id}
                and 
            op.status = '${WORKER_ASSIGN_TASK.complete}'
            group by
                op.order_id,
                op.category_id,
                c.category_name
            `,
			{ type: QueryTypes.SELECT }
		);
		// let data = await OrderProduct.findAll({
		// 	where: { status: WORKER_ASSIGN_TASK.complete, order_id: order_id },
		// 	attributes: [
		// 		"order_product_id",
		// 		"order_id",
		// 		"category_id",
		// 		[this.Sequelize.col("Category.category_name"), "category_name"],
		// 		"qty",
		// 		"price",
		// 		"status",
		// 	],
		// 	include: [{ model: Category, attributes: [] }],
		// 	raw: true,
		// });

		// const categoryWiseData: any = {};
		// data.forEach((item) => {
		// 	const key = `${item.order_id}_${item.category_id}`;
		// 	if (categoryWiseData[key]) {
		// 		categoryWiseData[key].qty += item.qty;
		// 	} else {
		// 		categoryWiseData[key] = { ...item };
		// 	}
		// });
		// let data_restructure = Object.values(categoryWiseData).map((item: any) => ({
		// 	order_product_id: item.order_product_id,
		// 	order_id: item.order_id,
		// 	category_id: item.category_id,
		// 	category_name: item.category_name,
		// 	qty: item.qty,
		// 	price: item.price,
		// 	status: item.status,
		// }));
		// return data_restructure;
	};
}
