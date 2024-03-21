import { Op, Transaction } from "sequelize";
import { ChestDetails, Customer, CustomerMeasurement, Order, OrderImages, OrderProduct } from "../models";
import { CreateOrderDTO, SearchDeliveryOrderRemainDTO, SearchOrderDTO } from "../dto";
import { executeTransaction } from "../config/database";
import { CustomerMeasurementAttributes } from "../models/customerMeasurement.model";
import { OrderProductAttributes } from "../models/orderProduct.model";
import { WORKER_ASSIGN_TASK } from "../constants";

export default class OrderService {
	public getAll = async (searchParams: SearchOrderDTO) => {
		return await Order.findAndCountAll({
			where: {
				...(searchParams.customer_id && { customer_id: searchParams.customer_id }),
				...(searchParams.start_date &&
					searchParams.end_date && {
						order_date: {
							[Op.between]: [searchParams.start_date, searchParams.end_date],
						},
					}),
			},
			attributes: ["order_id", "customer_id", "total", "payment", "order_date", "delivery_date", "shirt_pocket", "pant_pocket", "pant_pinch", "type"],
			order: [["order_date", "ASC"]],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public deliveryOrderRemain = async (searchParams: SearchDeliveryOrderRemainDTO) => {
		return await Order.findAndCountAll({
			where: {
				...(searchParams.start_date &&
					searchParams.end_date && {
						delivery_date: {
							[Op.between]: [searchParams.start_date, searchParams.end_date],
						},
					}),
			},
			attributes: ["order_id", "customer_id", "total", "payment", "order_date", "delivery_date", "shirt_pocket", "pant_pocket", "pant_pinch", "type"],
			order: [["delivery_date", "ASC"]],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public findOne = async (searchObject: any) => {
		return await Order.findOne({
			where: {
				...searchObject,
			},
			attributes: ["order_id", "customer_id", "total", "payment", "order_date", "delivery_date", "shirt_pocket", "pant_pocket", "pant_pinch", "type"],
			order: [["delivery_date", "ASC"]],
			raw: true,
		});
	};

	public create = async (orderData: CreateOrderDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			let customerId: string = "";
			if (orderData.customer_id == undefined) {
				await Customer.create(
					{ customer_name: orderData.customer_name, customer_mobile: orderData.customer_mobile, customer_address: orderData.customer_address },
					{ transaction }
				).then(async (data) => {
					customerId = data.customer_id;
				});
			} else {
				customerId = orderData.customer_id;
			}

			let customerMeasurementBulkData: Array<CustomerMeasurementAttributes> = [];
			orderData.customer_measurement.map((Workerdata) => {
				customerMeasurementBulkData.push({
					customer_id: customerId,
					category_id: Workerdata.category_id,
					measurement_id: Workerdata.measurement_id,
					measurement: Workerdata.measurement,
					measurement_2: Workerdata.measurement_2,
				});
			});
			let newOrderData = {
				customer_id: customerId,
				total: orderData.total,
				order_date: orderData.order_date,
				delivery_date: orderData.delivery_date,
				shirt_pocket: orderData.shirt_pocket,
				pant_pocket: orderData.pant_pocket,
				pant_pinch: orderData.pant_pinch,
				type: orderData.type,
			};

			await CustomerMeasurement.bulkCreate(customerMeasurementBulkData, { transaction });
			await Order.create(newOrderData, { transaction }).then(async (data) => {
				let orderDetailsBulkData: Array<OrderProductAttributes> = [];
				orderData.order_details.map((productData) => {
					orderDetailsBulkData.push({
						order_id: data.order_id,
						category_id: productData.category_id,
						price: productData.price,
						qty: productData.qty,
						status: WORKER_ASSIGN_TASK.pending,
					});
				});
				await OrderProduct.bulkCreate(orderDetailsBulkData, { transaction });
				return await OrderImages.create({ order_id: data.order_id, image_name: orderData.image_name }, { transaction });
			});
			return "Customer , CustomerMeasurement Data , OrderImage , Order Created Successfully Add";
		});
	};

	public edit = async (orderData: CreateOrderDTO, order_id: string, customer_id: string) => {
		return await executeTransaction(async (transaction: Transaction) => {
			let customerMeasurementBulkData: Array<CustomerMeasurementAttributes> = [];
			orderData.customer_measurement.map((Workerdata) => {
				customerMeasurementBulkData.push({
					customer_id: customer_id,
					category_id: Workerdata.category_id,
					measurement_id: Workerdata.measurement_id,
					measurement: Workerdata.measurement,
					measurement_2: Workerdata.measurement_2,
				});
			});
			let newOrderData = {
				customer_id: customer_id,
				total: orderData.total,
				order_date: orderData.order_date,
				delivery_date: orderData.delivery_date,
				shirt_pocket: orderData.shirt_pocket,
				pant_pocket: orderData.pant_pocket,
				pant_pinch: orderData.pant_pinch,
				type: orderData.type,
			};
			await CustomerMeasurement.destroy({ where: { customer_id: customer_id } }).then(async (data) => {
				return await CustomerMeasurement.bulkCreate(customerMeasurementBulkData, { transaction });
			});
			await Order.update(newOrderData, { where: { order_id: order_id }, transaction }).then(async (data) => {
				return await OrderImages.update({ order_id: order_id, image_name: orderData.image_name }, { where: { order_id: order_id }, transaction });
			});
			return "Customer, CustomerMeasurement Data, OrderImage, Order Edited Successfully Add";
		});
	};

	public payment = async (payment: number, order_id: string) => {
		await Order.update({ payment: payment }, { where: { order_id: order_id } });
	};

	public delete = async (order_id: string) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await Order.destroy({ where: { order_id: order_id }, transaction }).then(async () => {
				return await OrderImages.destroy({ where: { order_id: order_id }, transaction }).then(() => {
					return "Order Deleted successfully";
				});
			});
		});
	};
}
