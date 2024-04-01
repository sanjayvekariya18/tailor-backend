import { Op, QueryTypes, Transaction } from "sequelize";
import { Customer, CustomerMeasurement, Order, OrderImages, OrderPayment, OrderProduct } from "../models";
import { CreateOrderDTO, SearchDeliveryOrderRemainDTO, SearchOrderDTO } from "../dto";
import { executeTransaction, sequelizeConnection } from "../config/database";
import { CustomerMeasurementAttributes } from "../models/customerMeasurement.model";
import { OrderProductAttributes } from "../models/orderProduct.model";
import { WORKER_ASSIGN_TASK } from "../constants";
import { NotFoundHandler } from "../errorHandler";
import { OrderPaymentDTO, findCustomerMeasurementDTO, getCustomerPaymentDataDTO } from "../dto/order.dto";

export default class OrderService {
	private Sequelize = sequelizeConnection.Sequelize;
	// 	public getAll = async (searchParams: SearchOrderDTO) => {
	// 				return await sequelizeConnection.query(
	// 			`SELECT
	//     o.order_id,
	//     o.customer_id,
	//     o.total,
	//     o.payment,
	//     o.order_date,
	//     o.delivery_date,
	//     o.shirt_pocket,
	//     o.pant_pocket,
	//     o.pant_pinch,
	//     o.type,
	//     JSON_ARRAYAGG(JSON_OBJECT('category_id', op.category_id, 'category_name', c.category_name, 'qty', op.qty)) AS category,
	//     cust.customer_name,
	//     cust.customer_mobile,
	//     cust.customer_address
	// FROM
	//     parthdb.order o
	// JOIN
	//     parthdb.customer cust ON o.customer_id = cust.customer_id
	// LEFT JOIN
	//     parthdb.order_product op ON o.order_id = op.order_id
	// LEFT JOIN
	//     parthdb.category c ON op.category_id = c.category_id

	//     WHERE
	//     (o.order_date BETWEEN ${searchParams.start_date} AND ${searchParams.end_date})
	//     AND (o.customer_id = ${searchParams.customer_id} OR ${searchParams.customer_id} IS NULL)
	//     AND (cust.customer_mobile = ${searchParams.mobile_no} OR ${searchParams.mobile_no} IS NULL)
	// GROUP BY
	//     o.order_id,
	//     o.customer_id,
	//     o.total,
	//     o.payment,
	//     o.order_date,
	//     o.delivery_date,
	//     o.shirt_pocket,
	//     o.pant_pocket,
	//     o.pant_pinch,
	//     o.type,
	//     cust.customer_name,
	//     cust.customer_mobile,
	//     cust.customer_address
	//    LIMIT
	//     ${searchParams.rowsPerPage}
	// OFFSET
	//    ${searchParams.page}
	// `,
	// 			{ type: QueryTypes.SELECT }
	// 		);
	// 	};

	public getAll = async (searchParams: SearchOrderDTO) => {
		const query = `
        SELECT 
            o.order_id,
            o.customer_id,
            o.total,
            o.payment,
            o.order_date,
            o.delivery_date,
            o.shirt_pocket,
            o.pant_pocket,
            o.pant_pinch,
            o.type,
            JSON_ARRAYAGG(JSON_OBJECT('category_id', op.category_id, 'category_name', c.category_name, 'qty', op.qty)) AS category,
            cust.customer_name,
            cust.customer_mobile,
            cust.customer_address
        FROM 
            parthdb.order o
        JOIN 
            parthdb.customer cust ON o.customer_id = cust.customer_id
        LEFT JOIN 
            parthdb.order_product op ON o.order_id = op.order_id
        LEFT JOIN 
            parthdb.category c ON op.category_id = c.category_id
        WHERE 
            (:start_date IS NULL OR o.order_date BETWEEN :start_date AND :end_date)
            AND (:customer_id IS NULL OR o.customer_id = :customer_id)
            AND (:mobile_no IS NULL OR cust.customer_mobile = :mobile_no)
        GROUP BY 
            o.order_id,
            o.customer_id,
            o.total,
            o.payment,
            o.order_date,
            o.delivery_date,
            o.shirt_pocket,
            o.pant_pocket,
            o.pant_pinch,
            o.type,
            cust.customer_name,
            cust.customer_mobile,
            cust.customer_address 
        LIMIT 
            :rowsPerPage
        OFFSET 
            :offset`;

		const replacements: { [key: string]: any } = {};

		if (searchParams.start_date !== undefined) {
			replacements.start_date = searchParams.start_date;
			replacements.end_date = searchParams.end_date;
		} else {
			replacements.start_date = null;
			replacements.end_date = null;
		}

		if (searchParams.customer_id != undefined) {
			replacements.customer_id = searchParams.customer_id;
		} else {
			replacements.customer_id = null;
		}

		if (searchParams.mobile_no !== undefined) {
			replacements.mobile_no = searchParams.mobile_no;
		} else {
			replacements.mobile_no = null;
		}

		replacements.rowsPerPage = searchParams.rowsPerPage;
		replacements.offset = searchParams.page * searchParams.rowsPerPage;

		return await sequelizeConnection.query(query, {
			replacements,
			type: QueryTypes.SELECT,
		});
	};

	public findOneCustomerMeasurement = async (searchParams: findCustomerMeasurementDTO) => {
		const customer_data = await Customer.findOne({
			where: {
				...(searchParams.customer_id && { customer_id: searchParams.customer_id }),
				...(searchParams.mobile_no && { customer_mobile: searchParams.mobile_no }),
			},
			include: [{ model: CustomerMeasurement }],
			attributes: ["customer_id", "customer_name", "customer_mobile", "customer_address"],
		});

		// const response = {
		//     customer_data:{},
		//     measurements:[]
		// }

		// if (customer_data) {
		//     response.customer_data = {...customer_data}
		//     const measurement_data = await CustomerMeasurement.findAll({
		//         where:{
		//             customer_id:customer_data.customer_id
		//         },
		//         include:[{}]
		//     })
		// }
		return customer_data;
	};

	public getOrderDetails = async (order_id: string) => {
		const order_data = await Order.findByPk(order_id, {
			include: [{ model: Customer }, { model: OrderProduct }, { model: OrderImages }],
			attributes: ["order_id", "customer_id", "total", "payment", "order_date", "delivery_date", "shirt_pocket", "pant_pocket", "pant_pinch", "type"],
		});

		if (order_data) {
			const response_data: any = order_data.get({ plain: true });
			const category_ids = response_data.OrderProducts.map((row: any) => row.category_id);
			const customer_measurement_data = await CustomerMeasurement.findAll({
				where: { customer_id: order_data.customer_id, category_id: { [Op.in]: category_ids } },
			});
			response_data.OrderProducts.forEach((row: any) => {
				const customer_measurement = customer_measurement_data.filter((data) => data.category_id == row.category_id);
				row.customer_measurement = customer_measurement;
			});
			return response_data;
		} else {
			throw new NotFoundHandler("Order Not found");
		}
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
			attributes: [
				"order_id",
				"customer_id",
				[sequelizeConnection.Sequelize.col("Customer.customer_name"), "customer_name"],
				[sequelizeConnection.Sequelize.col("Customer.customer_mobile"), "customer_mobile"],
				[sequelizeConnection.Sequelize.col("Customer.customer_address"), "customer_address"],
				"total",
				"payment",
				"order_date",
				"delivery_date",
				"shirt_pocket",
				"pant_pocket",
				"pant_pinch",
				"type",
			],
			include: [{ model: Customer, attributes: [] }],
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
			let orderDetailsBulkData: Array<OrderProductAttributes> = [];
			orderData.order_details.map((productData) => {
				orderDetailsBulkData.push({
					order_id: order_id,
					category_id: productData.category_id,
					price: productData.price,
					qty: productData.qty,
					status: WORKER_ASSIGN_TASK.pending,
				});
			});
			await CustomerMeasurement.destroy({ where: { customer_id: customer_id } }).then(async (data) => {
				return await CustomerMeasurement.bulkCreate(customerMeasurementBulkData, { transaction });
			});
			await Order.update(newOrderData, { where: { order_id: order_id }, transaction }).then(async (data) => {
				await OrderProduct.destroy({ where: { order_id: order_id }, transaction });
				await OrderProduct.bulkCreate(orderDetailsBulkData, { transaction });
				return await OrderImages.update({ order_id: order_id, image_name: orderData.image_name }, { where: { order_id: order_id }, transaction });
			});
			return "Customer, CustomerMeasurement Data, OrderImage, Order Edited Successfully Add";
		});
	};

	public payment = async (orderData: OrderPaymentDTO, order_id: string) => {
		return await executeTransaction(async (transaction: Transaction) => {
			await Order.update({ payment: orderData.payment }, { where: { order_id: order_id }, transaction });
			await OrderPayment.create({ order_id: order_id, amount: orderData.payment, payment_date: orderData.payment_date }, { transaction });
		});
	};

	public getCustomerPaymentData = async (searchParams: getCustomerPaymentDataDTO) => {
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
			attributes: [
				"order_id",
				"customer_id",
				[this.Sequelize.col("Customer.customer_name"), "customer_name"],
				[this.Sequelize.col("Customer.customer_mobile"), "customer_mobile"],
				[this.Sequelize.col("Customer.customer_address"), "customer_address"],
				"total",
				"payment",
				"order_date",
				"delivery_date",
				"shirt_pocket",
				"pant_pocket",
				"pant_pinch",
				"type",
			],
			include: [{ model: Customer, attributes: [] }],
			order: [["delivery_date", "ASC"]],
			raw: true,
		});
	};

	public income = async (searchParams: getCustomerPaymentDataDTO) => {
		return await OrderPayment.findAndCountAll({
			where: {
				...(searchParams.start_date &&
					searchParams.end_date && {
						payment_date: {
							[Op.between]: [searchParams.start_date, searchParams.end_date],
						},
					}),
			},
			attributes: [
				"order_id",
				[this.Sequelize.col("Order.Customer.customer_name"), "customer_name"],
				[this.Sequelize.col("Order.Customer.customer_id"), "customer_id"],
				"amount",
				"payment_date",
			],
			include: [
				{
					model: Order,
					attributes: [],
					include: [{ model: Customer, attributes: [], where: { ...(searchParams.customer_id && { customer_id: searchParams.customer_id }) } }],
				},
			],
			order: [["payment_date", "ASC"]],
			raw: true,
		});
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
