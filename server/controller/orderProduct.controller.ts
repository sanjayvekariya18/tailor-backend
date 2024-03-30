import { NextFunction, Request, Response } from "express";
import { fileType, isEmpty, saveFile } from "../utils/helper";
import { OrderProductValidation, OrderValidation } from "../validations";
import { CategoryService, CustomerService, MeasurementService, OrderProductService, OrderService } from "../services";
import { CreateOrderDTO, SearchDeliveryOrderRemainDTO, SearchOrderDTO, SearchOrderProductDTO, createOrderProductDTO } from "../dto";
import { WORKER_ASSIGN_TASK, image } from "../constants";
import { BadResponseHandler } from "../errorHandler";
import { OrderProduct, WorkerPrice } from "../models";
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
				price: orderData.price,
				work_price: getWorkerPrice.price,
				work_total: getWorkerPrice.price * orderData.qty,
				assign_date: orderData.assign_date,
				status: WORKER_ASSIGN_TASK.assign,
			};
			let availableQty = assignTask?.qty - orderData.qty;
			console.log(availableQty);

			let data = await this.orderProductService.assignTask(newOrderData, assignTask.order_product_id, availableQty);
			return res.api.create(data);
		},
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