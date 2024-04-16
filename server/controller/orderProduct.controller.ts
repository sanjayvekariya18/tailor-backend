import { NextFunction, Request, Response } from "express";
import { OrderProductValidation } from "../validations";
import { CategoryService, OrderProductService, OrderService } from "../services";
import { SearchOrderProductDTO, BulkCreatedDTO, createOrderProductDTO } from "../dto";
import { WORKER_ASSIGN_TASK } from "../constants";
import { BadResponseHandler, FormErrorsHandler, NotFoundHandler } from "../errorHandler";
import { Category, OrderProduct, WorkerPrice } from "../models";
import { Op } from "sequelize";

export default class OrderController {
	public orderProductValidation = new OrderProductValidation();
	public orderProductService = new OrderProductService();
	public orderService = new OrderService();
	public categoryService = new CategoryService();

	public getAll = {
		validation: this.orderProductValidation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.orderProductService.getAll(new SearchOrderProductDTO(req.query));
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.orderProductValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const orderData = new createOrderProductDTO(req.body);
			let categoryData = await this.categoryService.findOne({ category_id: orderData.category_id });
			let checkOrderData = await this.orderService.findOne({ order_id: orderData.order_id });
			let assignTask = await this.orderProductService.findOne({
				order_id: orderData.order_id,
				category_id: orderData.category_id,
				assign_date: null,
			});

			let getWorkerPrice = await WorkerPrice.findOne({ where: { worker_id: orderData.worker_id, category_id: orderData.category_id } });

			if (assignTask == null) {
				throw new BadResponseHandler("Order Product Not Found");
			}

			if (checkOrderData == null) {
				throw new BadResponseHandler("Order Not Found");
			}

			if (categoryData == null) {
				throw new BadResponseHandler("Category Not Found");
			}

			if (getWorkerPrice == null) {
				throw new BadResponseHandler("Worker Price Not Found");
			}

			if (assignTask?.qty < orderData.qty) {
				throw new BadResponseHandler("Enter Valid qty ");
			}

			let newOrderData = {
				order_id: orderData.order_id,
				category_id: orderData.category_id,
				worker_id: orderData.worker_id,
				qty: orderData.qty,
				price: assignTask.price,
				work_price: getWorkerPrice.price,
				work_total: getWorkerPrice.price * orderData.qty,
				assign_date: orderData.assign_date,
				status: WORKER_ASSIGN_TASK.assign,
			};

			let availableQty = assignTask?.qty - orderData.qty;

			let workerPayment = {
				worker_id: orderData.worker_id,
				amount: getWorkerPrice.price * orderData.qty,
				type: 0,
				payment_date: orderData.assign_date,
			};

			let data = await this.orderProductService.assignTask(newOrderData, assignTask.order_product_id, availableQty, workerPayment);
			return res.api.create(data);
		},
	};

	public bulkCreate = {
		validation: this.orderProductValidation.bulkCreated,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const orderData = new BulkCreatedDTO(req.body);
			const category_ids = orderData.worker_task.map((row) => row.category_id);
			const order_ids = orderData.worker_task.map((row) => row.order_id);

			const errors: any = {};

			const category_data = await Category.findAll({ where: { category_id: { [Op.in]: category_ids } }, raw: true });
			if (category_ids.length != category_data.length) {
				const not_found = category_data.map((row) => row.category_id).filter((data) => !category_ids.includes(data));
				errors.category_id = [`${not_found.join(", ")} categories not found`];
			}

			const order_product_data = await OrderProduct.findAll({
				where: { order_id: { [Op.in]: order_ids }, category_id: { [Op.in]: category_ids }, assign_date: null },
			});

			for (const data of orderData.worker_task) {
				const index = order_product_data.findIndex((row) => row.category_id == data.category_id && row.order_id == data.order_id);
				if (index == -1) {
					if (!errors.order_product) {
						errors.order_product = [];
					}
					errors.order_product.push(`Order Product with category ${data.category_id} not found in order ${data.order_id}`);
				} else if (order_product_data[index].qty < data.qty) {
					if (!errors.qty) {
						errors.qty = [];
					}
					errors.qty.push(
						`Order Product with category ${data.category_id} not found in order ${data.order_id} has total ${order_product_data[index].qty} qty`
					);
				}
			}

			const worker_price_data = await WorkerPrice.findAll({ where: { worker_id: orderData.worker_id } });
			for (const tasks of orderData.worker_task) {
				const index = worker_price_data.findIndex((row) => row.category_id == tasks.category_id);
				if (index == -1) {
					if (!errors.qty) {
						errors.price = [];
					}
					errors.price.push(`Worker price for category ${tasks.category_id} not found`);
				}
			}

			if (Object.keys(errors).length > 0) {
				throw new FormErrorsHandler(errors);
			}

			for await (const task of orderData.worker_task) {
				const Worker_price_index = worker_price_data.findIndex((row) => row.category_id == task.category_id);
				if (Worker_price_index > -1) {
					const getWorkerPrice = worker_price_data[Worker_price_index];
					let newOrderData = {
						order_id: task.order_id,
						category_id: task.category_id,
						worker_id: orderData.worker_id,
						qty: task.qty,
						price: task.price,
						work_price: getWorkerPrice.price,
						work_total: getWorkerPrice.price * task.qty,
						assign_date: orderData.assign_date,
						status: WORKER_ASSIGN_TASK.assign,
					};

					const order_product_index = order_product_data.findIndex((row) => row.category_id == task.category_id && row.order_id == task.order_id);

					let availableQty = order_product_data[order_product_index].qty - task.qty;

					let workerPayment = {
						worker_id: orderData.worker_id,
						amount: getWorkerPrice.price * task.qty,
						type: 0,
						payment_date: orderData.assign_date,
					};

					await this.orderProductService.assignTask(
						newOrderData,
						order_product_data[order_product_index].order_product_id,
						availableQty,
						workerPayment
					);
				}
			}
			return res.api.create({ message: "Tasks assigned" });
		},
	};

	public changeStatus = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let orderProductId: string = req.params["order_product_id"] as string;
			let checkOrderProductData = await this.orderProductService.findOne({ order_product_id: orderProductId });
			if (checkOrderProductData == null) {
				throw new BadResponseHandler("Order Product Not Found");
			}
			return await OrderProduct.update({ status: WORKER_ASSIGN_TASK.complete }, { where: { order_product_id: orderProductId } }).then((data) => {
				return res.api.create("Worker Task Completed");
			});
		},
	};
}
