import { Op, Transaction } from "sequelize";
import { Customer, CustomerMeasurement, Order, OrderImages } from "../models";
import { CreateOrderDTO, SearchOrderDTO } from "../dto";
import { executeTransaction } from "../config/database";
import { CustomerMeasurementAttributes } from "../models/customerMeasurement.model";

export default class OrderService {
	public getAll = async (searchParams: SearchOrderDTO) => {
		return await Order.findAndCountAll({
			where: {},
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
				payment: orderData.payment,
				order_date: orderData.order_date,
				delivery_date: orderData.delivery_date,
				shirt_pocket: orderData.shirt_pocket,
				pant_pocket: orderData.pant_pocket,
				pant_pinch: orderData.pant_pinch,
				type: orderData.type,
			};
			await CustomerMeasurement.bulkCreate(customerMeasurementBulkData, { transaction });
			await Order.create(newOrderData, { transaction }).then(async (data) => {
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
				payment: orderData.payment,
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
}
