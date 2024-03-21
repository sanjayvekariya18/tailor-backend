import { NextFunction, Request, Response } from "express";
import { fileType, isEmpty, saveFile } from "../utils/helper";
import { OrderProductValidation, OrderValidation } from "../validations";
import { CategoryService, CustomerService, MeasurementService, OrderProductService, OrderService } from "../services";
import { CreateOrderDTO, SearchDeliveryOrderRemainDTO, SearchOrderDTO, SearchOrderProductDTO, createOrderProductDTO } from "../dto";
import { WORKER_ASSIGN_TASK, image } from "../constants";
import { BadResponseHandler } from "../errorHandler";
import { OrderProduct } from "../models";
import { where } from "sequelize";

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
			let categoryData = await this.categoryService.findOne({ where: { category_id: orderData.category_id } });
			let checkOrderData = await this.orderService.findOne({ where: { order_id: orderData.order_id } });
			let assignTask = await this.orderProductService.findOne({ where: { order_product_id: orderData.order_product_id } });
			if (assignTask == null) {
				throw new BadResponseHandler("Order Product Not Found");
			}

			if (checkOrderData == null) {
				throw new BadResponseHandler("Order Not Found");
			}

			if (categoryData == null) {
				throw new BadResponseHandler("Category Not Found");
			}

			let WorkerTask = {
				order_id: orderData.order_id,
				worker_id: orderData.worker_id,
				qty: assignTask.qty - orderData.qty,
				worker_price: orderData.work_price,
				work_total: orderData.work_total,
			};
			let newOrderData = {
				order_id: orderData.order_id,
				category_id: orderData.category_id,
				worker_id: orderData.worker_id,
				qty: orderData.qty,
				price: orderData.price,
				work_price: orderData.work_price,
				work_total: orderData.work_total,
				assign_date: orderData.assign_date,
				status: WORKER_ASSIGN_TASK.assign,
			};

			let data = await this.orderProductService.assignTask(WorkerTask, newOrderData);

			return res.api.create(data);
		},
	};

	public workerAssignTask = {
		validation: this.orderProductValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {},
	};

	public changeStatus = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let orderProductId: string = req.params["order_product_id"] as string;
			let checkOrderProductData = await this.orderProductService.findOne({ where: { order_product_id: orderProductId } });
			if (checkOrderProductData == null) {
				throw new BadResponseHandler("Order Product Not Found");
			}
			return await OrderProduct.update({ status: WORKER_ASSIGN_TASK.complete }, { where: { order_product_id: orderProductId } }).then((data) => {
				return res.api.create("Worker Task Completed");
			});
		},
	};
}
