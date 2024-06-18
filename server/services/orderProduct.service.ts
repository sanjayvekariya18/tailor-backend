import { Category, Customer, Order, OrderProduct, Worker, WorkerPayment } from "../models";
import { GetWorkerAssignTaskDTO, SearchOrderProductDTO, createOrderProductDTO } from "../dto";
import { executeTransaction, sequelizeConnection } from "../config/database";
import { QueryTypes, Transaction } from "sequelize";
import { Op } from "sequelize";
import { WORKER_ASSIGN_TASK } from "../constants";
import moment from "moment";

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
				...(searchParams.customer_id && {
					order_id: {
						[Op.in]: this.Sequelize.literal(`(select order_id from orders where customer_id = ${searchParams.customer_id})`),
					},
				}),
				...(searchParams.mobile_no && {
					order_id: {
						[Op.in]: this.Sequelize.literal(`
                            (SELECT 
                                o.order_id
                            FROM
                                orders o
                                left join customer c on c.customer_id = o.customer_id
                            WHERE
                                c.customer_mobile like '%${searchParams.mobile_no}%')
                           `),
					},
				}),
				...(searchParams.customer_name && {
					order_id: {
						[Op.in]: this.Sequelize.literal(`
                            (SELECT 
                                o.order_id
                            FROM
                                orders o
                                left join customer c on c.customer_id = o.customer_id
                            WHERE
                                c.customer_name like '%${searchParams.customer_name}%')
                           `),
					},
				}),
				...(searchParams.status && { status: searchParams.status }),
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
				[this.Sequelize.col("Order.delivery_date"), "delivery_date"],
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
			order: [
				["order_date", "DESC"],
				["assign_date", "DESC"],
			],
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

	public assignTask = async (orderProductData: createOrderProductDTO, order_product_id: number, qty: number, workerPayment: any) => {
		return await executeTransaction(async (transaction: Transaction) => {
			await OrderProduct.create(orderProductData, { transaction });
			await OrderProduct.update({ qty: qty }, { where: { order_product_id: order_product_id }, transaction });
			await OrderProduct.destroy({ where: { qty: 0 }, transaction });
			await WorkerPayment.create(workerPayment, { transaction });
			return "OrderProduct Assign Successfully";
		});
	};

	public getWorkerAssignTask = async (searchParams: GetWorkerAssignTaskDTO) => {
		return await OrderProduct.findAll({
			where: { order_id: searchParams.order_id, category_id: searchParams.category_id, status: WORKER_ASSIGN_TASK.assign },
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
		});
	};

	public getPendingOrder = async () => {
		let today_date = moment().format("YYYY-MM-DD");
		let lastFiveDate = moment().subtract(5, "days").format("YYYY-MM-DD");
		return await Order.findAll({
			where: {
				[Op.and]: [this.Sequelize.literal(`DATE_FORMAT(order_date, '%Y-%m-%d') BETWEEN '${lastFiveDate}' AND '${today_date}'`)],
			},
			include: [{ model: Customer }, { model: OrderProduct, where: { status: WORKER_ASSIGN_TASK.pending }, include: [{ model: Category }] }],
			order: [["order_date", "DESC"]],
		});
	};

	public getPending_completed_order = async () => {
		let pending_order = await OrderProduct.findAll({
			where: {
				status: WORKER_ASSIGN_TASK.pending,
			},
			include: [
				{ model: Order, attributes: [], include: [{ model: Customer, attributes: ["customer_id", "customer_name", "customer_mobile"] }] },
				{ model: Category, attributes: [] },
			],
			attributes: [
				"order_product_id",
				"order_id",
				"category_id",
				[this.Sequelize.col("Category.category_name"), "category_name"],
				[this.Sequelize.col("Order.order_date"), "order_date"],
				[this.Sequelize.col("Order.customer_id"), "customer_id"],
				[this.Sequelize.col("Order.Customer.customer_name"), "customer_name"],
				[this.Sequelize.col("Order.Customer.customer_mobile"), "customer_mobile"],
				"worker_id",
				"parent",
				"qty",
				"status",
				"price",
				"work_price",
				"work_total",
				"assign_date",
			],
			order: [["order_date", "DESC"]],
			raw: true,
		});
		let completed_order = await OrderProduct.findAll({
			where: {
				status: WORKER_ASSIGN_TASK.complete,
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
			order: [["order_date", "DESC"]],
			raw: true,
		});
		return { pending_order, completed_order };
	};

	public get_order_status = async (order_id: number) => {
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
                o.bill_no,
                if(SUM(op.total_qty) = SUM(op.complete), 'complete', if(SUM(op.pending)+SUM(op.assign) < SUM(op.total_qty), 'partial pending', 'pending')) as status,
                cust.customer_id,
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
                o.order_id = ${order_id}
            GROUP BY 
                o.order_id,
                cust.customer_name,
                cust.customer_mobile,
                cust.customer_address
            `;

		const db_data: Array<any> = await sequelizeConnection.query(query, {
			type: QueryTypes.SELECT,
		});

		let response_data = {
			status: "",
			customer_no: 0,
			customer_name: "",
			mobile_number: "",
		};

		if (db_data.length > 0) {
			response_data.status = db_data[0].status;
			response_data.customer_no = db_data[0].customer_id;
			response_data.customer_name = db_data[0].customer_name;
			response_data.mobile_number = db_data[0].customer_mobile;
		}

		return response_data;
	};
}
