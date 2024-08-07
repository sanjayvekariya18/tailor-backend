import { Op, QueryTypes, Transaction } from "sequelize";
import { Category, Customer, CustomerMeasurement, Measurement, Order, OrderImages, OrderPayment, OrderProduct, Worker } from "../models";
import {
	CreateOrderDTO,
	SearchDeliveryOrderRemainDTO,
	SearchOrderDTO,
	OrderPaymentDTO,
	findCustomerMeasurementDTO,
	getCustomerBillDTO,
	getCustomerPaymentDataDTO,
} from "../dto";
import { executeTransaction, sequelizeConnection } from "../config/database";
import { OrderProductAttributes } from "../models/orderProduct.model";
import { BILL_STATUS, NOTIFICATION_TEMPLATE, WORKER_ASSIGN_TASK } from "../constants";
import { NotFoundHandler } from "../errorHandler";
import WhatsAppAPIService from "./whatsApp.service";
import moment from "moment";

export default class OrderService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchOrderDTO) => {
		let query = `
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
                o.bill_no,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'category_id', op.category_id,
                        'category_name',op.category_name,
                        'category_image',op.category_image,
                        'total_qty', op.total_qty,
                        'pending', op.pending,
                        'complete', op.complete,
                        'assign', op.assign
                    )
                ) AS order_products,
                if(SUM(op.total_qty) = SUM(op.complete), 'complete', if(SUM(op.pending)+SUM(op.assign) < SUM(op.total_qty), 'partial pending', 'pending')) as status,
                cust.customer_name,
                cust.customer_mobile,
                cust.customer_address
            FROM 
                \`orders\` o
            JOIN 
                customer cust ON o.customer_id = cust.customer_id
            LEFT JOIN 
                (
                    SELECT 
                        op.order_id,
                        op.category_id,
                        c.category_name,
                        c.category_image,
                        SUM(op.qty) AS total_qty,
                        SUM(CASE WHEN op.status = '${WORKER_ASSIGN_TASK.pending}' THEN op.qty ELSE 0 END) AS pending,
                        SUM(CASE WHEN op.status = '${WORKER_ASSIGN_TASK.complete}' THEN op.qty ELSE 0 END) AS complete,
                        SUM(CASE WHEN op.status = '${WORKER_ASSIGN_TASK.assign}' THEN op.qty ELSE 0 END) AS assign
                    FROM 
                        order_product op
                    LEFT JOIN 
                        category c ON op.category_id = c.category_id
                    GROUP BY 
                        op.order_id,
                        op.category_id,
                        c.category_name,
                        c.category_image
                ) AS op ON o.order_id = op.order_id
            WHERE 
                (:start_date IS NULL OR o.order_date BETWEEN :start_date AND :end_date)
                AND (:customer_id IS NULL OR o.customer_id = :customer_id)
                AND (:mobile_no IS NULL OR cust.customer_mobile = :mobile_no)
            GROUP BY 
                o.order_id,
                cust.customer_name,
                cust.customer_mobile,
                cust.customer_address
            ${searchParams.status ? `having status = '${searchParams.status}'` : ""}
            ORDER BY o.bill_no DESC
            `;

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

		const count_data: Array<any> = await sequelizeConnection.query(query, {
			replacements,
			type: QueryTypes.SELECT,
		});
		query += ` LIMIT ${replacements.offset}, ${replacements.rowsPerPage};`;
		const order_data = await sequelizeConnection.query(query, {
			replacements,
			type: QueryTypes.SELECT,
		});

		return {
			count: count_data.length,
			rows: order_data,
		};
	};

	public getCustomerMeasurement = async (order_id: number) => {
		let orderData = await Order.findOne({
			where: {
				order_id: order_id,
			},
			attributes: [
				"order_id",
				"customer_id",
				"total",
				"payment",
				"order_date",
				"delivery_date",
				"shirt_pocket",
				"pant_pocket",
				"pant_pinch",
				"type",
				"bill_no",
			],
			include: [{ model: Customer, include: [{ model: CustomerMeasurement, include: [{ model: Category }, { model: Measurement }] }] }],
			order: [["delivery_date", "ASC"]],
		});
		return orderData;
	};

	public getOrderProductCategoryWise = async (orderId: number) => {
		return await sequelizeConnection.query(
			`
            SELECT 
                c.category_id, c.category_name, c.category_type, SUM(op.qty) as qty
            FROM
                order_product op
                    LEFT JOIN
                orders o ON o.order_id = op.order_id
                    LEFT JOIN
                category c ON c.category_id = op.category_id
            WHERE
                o.order_id = ${orderId}
            GROUP BY c.category_id, c.category_name, c.category_type;
            `,
			{ type: QueryTypes.SELECT }
		);
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
		return customer_data;
	};

	public getOrderDetails = async (order_id: number) => {
		const order_data = await Order.findByPk(order_id, {
			include: [{ model: Customer }, { model: OrderProduct }, { model: OrderImages }],
			attributes: [
				"order_id",
				"customer_id",
				"total",
				"payment",
				"order_date",
				"delivery_date",
				"shirt_pocket",
				"pant_pocket",
				"pant_pinch",
				"type",
				"bill_no",
			],
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

			const aggregatedProducts: any = {};

			response_data.OrderProducts.forEach((product: any) => {
				const key = `${product.order_id}_${product.category_id}`;
				if (!aggregatedProducts[key]) {
					aggregatedProducts[key] = { ...product };
				} else {
					aggregatedProducts[key].qty += product.qty;
				}
			});
			response_data.OrderProducts = Object.values(aggregatedProducts);
			return response_data;
		} else {
			throw new NotFoundHandler("Order Not found");
		}
	};

	public deliveryOrderRemain = async (searchParams: SearchOrderDTO) => {
		let query = `
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
                o.bill_no,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'category_id', op.category_id,
                        'category_name',op.category_name,
                        'category_image',op.category_image,
                        'total_qty', op.total_qty,
                        'pending', op.pending,
                        'complete', op.complete,
                        'assign', op.assign
                    )
                ) AS order_products,
                if(SUM(op.total_qty) = SUM(op.complete), 'complete', if(SUM(op.pending)+SUM(op.assign) < SUM(op.total_qty), 'partial pending', 'pending')) as status,
                cust.customer_name,
                cust.customer_mobile,
                cust.customer_address
            FROM 
                \`orders\` o
            JOIN 
                customer cust ON o.customer_id = cust.customer_id
            LEFT JOIN 
                (
                    SELECT 
                        op.order_id,
                        op.category_id,
                        c.category_name,
                        c.category_image,
                        SUM(op.qty) AS total_qty,
                        SUM(CASE WHEN op.status = '${WORKER_ASSIGN_TASK.pending}' THEN op.qty ELSE 0 END) AS pending,
                        SUM(CASE WHEN op.status = '${WORKER_ASSIGN_TASK.complete}' THEN op.qty ELSE 0 END) AS complete,
                        SUM(CASE WHEN op.status = '${WORKER_ASSIGN_TASK.assign}' THEN op.qty ELSE 0 END) AS assign
                    FROM 
                        order_product op
                    LEFT JOIN 
                        category c ON op.category_id = c.category_id
                    GROUP BY 
                        op.order_id,
                        op.category_id,
                        c.category_name,
                        c.category_image
                ) AS op ON o.order_id = op.order_id
            WHERE 
                (:start_date IS NULL OR o.delivery_date BETWEEN :start_date AND :end_date)
                AND (:customer_id IS NULL OR o.customer_id = :customer_id)
                AND (:mobile_no IS NULL OR cust.customer_mobile = :mobile_no)
            GROUP BY 
                o.order_id,
                cust.customer_name,
                cust.customer_mobile,
                cust.customer_address
            ORDER BY
                o.delivery_date DESC
            `;
		const replacements: { [key: string]: any } = {};
		if (searchParams.start_date !== undefined) {
			replacements.start_date = moment(searchParams.start_date).format("YYYY-MM-DD");
			replacements.end_date = moment(searchParams.end_date).format("YYYY-MM-DD");
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

		const count_data: Array<any> = await sequelizeConnection.query(query, {
			replacements,
			type: QueryTypes.SELECT,
		});
		query += ` LIMIT ${replacements.offset}, ${replacements.rowsPerPage};`;
		const order_data = await sequelizeConnection.query(query, {
			replacements,
			type: QueryTypes.SELECT,
		});

		const summary_data = await sequelizeConnection.query(
			`
            SELECT 
                op.category_id,
                c.category_name,
                c.category_image,
                SUM(op.qty) AS quantity
            FROM
                orders o
                    LEFT JOIN
                order_product op ON op.order_id = o.order_id
                    LEFT JOIN
                category c ON c.category_id = op.category_id
                    LEFT JOIN
                customer cust ON o.customer_id = cust.customer_id
            WHERE
                (:start_date IS NULL OR o.delivery_date BETWEEN :start_date AND :end_date)
                AND (:customer_id IS NULL OR o.customer_id = :customer_id)
                AND (:mobile_no IS NULL OR cust.customer_mobile = :mobile_no)
            GROUP BY op.category_id
            ORDER BY c.category_id
            `,
			{ replacements, type: QueryTypes.SELECT }
		);

		return {
			summary: summary_data,
			count: count_data.length,
			rows: order_data,
		};
	};

	public findOne = async (searchObject: any) => {
		return await Order.findOne({
			where: {
				...searchObject,
			},
			attributes: [
				"order_id",
				"customer_id",
				"total",
				"payment",
				"order_date",
				"delivery_date",
				"shirt_pocket",
				"pant_pocket",
				"pant_pinch",
				"type",
				"bill_no",
			],
			order: [["delivery_date", "ASC"]],
			raw: true,
		});
	};

	public create = async (orderData: CreateOrderDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			let customerId: number = 0;
			if (orderData.customer_id == undefined) {
				await Customer.create(
					{ customer_name: orderData.customer_name, customer_mobile: orderData.customer_mobile, customer_address: orderData.customer_address },
					{ transaction }
				).then(async (data) => {
					customerId = data.customer_id;
				});
			} else {
				customerId = orderData.customer_id;
				await Customer.update(
					{
						customer_name: orderData.customer_name,
						customer_mobile: orderData.customer_mobile,
						customer_address: orderData.customer_address,
					},
					{ where: { customer_id: customerId }, transaction }
				);
			}
			let bill_no: number = await Order.max("bill_no");

			// let customerMeasurementBulkData: Array<CustomerMeasurementAttributes> = [];
			// orderData.customer_measurement.map((Workerdata) => {
			// 	customerMeasurementBulkData.push({
			// 		customer_id: customerId,
			// 		category_id: Workerdata.category_id,
			// 		measurement_id: Workerdata.measurement_id,
			// 		measurement: Workerdata.measurement,
			// 		measurement_2: Workerdata.measurement_2,
			// 	});
			// });
			let newOrderData = {
				customer_id: customerId,
				total: orderData.total,
				order_date: orderData.order_date,
				delivery_date: orderData.delivery_date,
				shirt_pocket: orderData.shirt_pocket,
				pant_pocket: orderData.pant_pocket,
				pant_pinch: orderData.pant_pinch,
				type: orderData.type,
				bill_no: bill_no + 1,
			};

			const customer_measurement_data = await CustomerMeasurement.findAll({ where: { customer_id: customerId }, transaction });

			for await (const measurement of orderData.customer_measurement) {
				const customer_measurement = customer_measurement_data.find(
					(row) => row.category_id == measurement.category_id && row.measurement_id == measurement.measurement_id
				);

				if (customer_measurement) {
					customer_measurement.measurement = measurement.measurement;
					customer_measurement.measurement_2 = measurement.measurement_2;
					await customer_measurement.save({ transaction });
				} else {
					await CustomerMeasurement.create({ ...measurement, customer_id: customerId }, { transaction }).then((data) => {
						customer_measurement_data.push(data);
					});
				}
			}

			// await CustomerMeasurement.bulkCreate(customerMeasurementBulkData, { transaction });
			const order_data = await Order.create(newOrderData, { transaction }).then(async (data) => {
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
				// Uncomment Below Logic To send notification
				// const customer_data = await Customer.findByPk(customerId);
				// if (customer_data && customer_data.customer_mobile != "") {
				// 	// await WhatsAppAPIService.sendMessage(customer_data.customer_mobile, NOTIFICATION_TEMPLATE.CREATE, {
				// 	// 	customer_name: customer_data.customer_name,
				// 	// 	order_number: data.bill_no.toString(),
				// 	// });
				// }
				const images_data = orderData.image_name.map((row) => {
					return {
						order_id: data.order_id,
						image_name: row,
					};
				});
				await OrderImages.bulkCreate(images_data, { transaction });
				return data;
			});

			return order_data;
		});
	};

	public edit = async (orderData: CreateOrderDTO, order_id: number, customer_id: number) => {
		return await executeTransaction(async (transaction: Transaction) => {
			// let customerMeasurementBulkData: Array<CustomerMeasurementAttributes> = [];
			// orderData.customer_measurement.map((Workerdata) => {
			// 	customerMeasurementBulkData.push({
			// 		customer_id: customer_id,
			// 		category_id: Workerdata.category_id,
			// 		measurement_id: Workerdata.measurement_id,
			// 		measurement: Workerdata.measurement,
			// 		measurement_2: Workerdata.measurement_2,
			// 	});
			// });
			await Customer.update(
				{
					customer_name: orderData.customer_name,
					customer_mobile: orderData.customer_mobile,
					customer_address: orderData.customer_address,
				},
				{ where: { customer_id }, transaction }
			);
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

			const customer_measurement_data = await CustomerMeasurement.findAll({ where: { customer_id: customer_id }, transaction });

			for await (const measurement of orderData.customer_measurement) {
				const customer_measurement = customer_measurement_data.find(
					(row) => row.category_id == measurement.category_id && row.measurement_id == measurement.measurement_id
				);

				if (customer_measurement) {
					customer_measurement.measurement = measurement.measurement;
					customer_measurement.measurement_2 = measurement.measurement_2;
					await customer_measurement.save({ transaction });
				} else {
					await CustomerMeasurement.create({ ...measurement, customer_id }, { transaction }).then((data) => {
						customer_measurement_data.push(data);
					});
				}
			}

			await Order.update(newOrderData, { where: { order_id: order_id }, transaction }).then(async (data) => {
				await OrderProduct.destroy({ where: { order_id: order_id }, transaction });
				await OrderProduct.bulkCreate(orderDetailsBulkData, { transaction });
				const images_data = orderData.image_name.map((row) => {
					return {
						order_id,
						image_name: row,
					};
				});
				return await OrderImages.bulkCreate(images_data, { transaction });
			});
			return await this.findOne({ order_id });
		});
	};

	public payment = async (orderData: OrderPaymentDTO, order_id: number) => {
		return await executeTransaction(async (transaction: Transaction) => {
			await OrderPayment.create({ order_id: order_id, amount: orderData.payment, payment_date: orderData.payment_date }, { transaction }).then(
				async () => {
					let payment = 0;
					await OrderPayment.findAll({ where: { order_id: order_id }, raw: true, transaction }).then((data) => {
						data.map((item) => {
							payment += item.amount;
						});
					});
					await Order.update({ payment: payment }, { where: { order_id: order_id }, transaction });
				}
			);
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

				...(searchParams.bill_status &&
					searchParams.bill_status == BILL_STATUS.UNPAID && {
						payment: 0,
					}),
			},
			...(searchParams.bill_status &&
				searchParams.bill_status == BILL_STATUS.PAID && {
					where: this.Sequelize.where(this.Sequelize.col("payment"), "=", this.Sequelize.col("total")),
				}),
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
				"bill_no",
			],
			include: [{ model: Customer, attributes: [] }],
			order: [["delivery_date", "DESC"]],
			raw: true,
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public getCustomerBill = async (searchParams: getCustomerBillDTO) => {
		const order_data = await Order.findOne({
			where: { bill_no: searchParams.bill_no },
			include: [{ model: Customer }, { model: OrderProduct, include: [{ model: Category }] }],
			attributes: [
				"order_id",
				"customer_id",
				"total",
				"payment",
				"order_date",
				"delivery_date",
				"shirt_pocket",
				"pant_pocket",
				"pant_pinch",
				"type",
				"bill_no",
			],
		});
		if (order_data) {
			const response_data: any = order_data.get({ plain: true });
			const category_ids = response_data.OrderProducts.map((row: any) => row.category_id);
			const worker_ids = response_data.OrderProducts.map((row: any) => row.worker_id);
			const worker_data = await Worker.findAll({ where: { worker_id: { [Op.in]: worker_ids } } });
			response_data.workers_data = worker_data;
			const customer_measurement_data = await CustomerMeasurement.findAll({
				where: { customer_id: order_data.customer_id, category_id: { [Op.in]: category_ids } },
			});
			response_data.OrderProducts.forEach((row: any) => {
				const customer_measurement = customer_measurement_data.filter((data) => data.category_id == row.category_id);
				row.customer_measurement = customer_measurement;
			});
			return response_data;
		} else {
			throw new NotFoundHandler("Bill not found");
		}
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
					where: { ...(searchParams.customer_id && { customer_id: searchParams.customer_id }) },
					include: [{ model: Customer, attributes: [] }],
				},
			],
			order: [["payment_date", "DESC"]],
			raw: true,
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public delete = async (order_id: number) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await Order.destroy({ where: { order_id: order_id }, transaction }).then(async () => {
				return await OrderImages.destroy({ where: { order_id: order_id }, transaction }).then(() => {
					return "Order Deleted successfully";
				});
			});
		});
	};

	public deletedImage = async (order_image_id: number) => {
		return await OrderImages.destroy({ where: { order_image_id: order_image_id } });
	};
}
