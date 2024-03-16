import { NextFunction, Request, Response } from "express";
import { fileType, isEmpty, saveFile } from "../utils/helper";
import { OrderValidation } from "../validations";
import { CategoryService, CustomerService, MeasurementService, OrderService } from "../services";
import { CreateOrderDTO, SearchOrderDTO } from "../dto";
import { image } from "../constants";
import { BadResponseHandler } from "../errorHandler";
import { string } from "joi";

export default class OrderController {
	private orderService = new OrderService();
	private categoryService = new CategoryService();
	private measurementService = new MeasurementService();
	private customerService = new CustomerService();
	private orderValidation = new OrderValidation();

	public getAll = {
		validation: this.orderValidation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.orderService.getAll(new SearchOrderDTO(req.query));
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.orderValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const orderData = new CreateOrderDTO(req.body);

			const file: any = req.files;
			if (file) {
				if (file.image_name) {
					let fileValidation = fileType(file.image_name, image);
					if (fileValidation === false) {
						return res.api.validationErrors({
							message: ["Invalid image_name file"],
						});
					}
					let file_path: any = await saveFile(file.image_name, "OrderImage");
					orderData.image_name = file_path.upload_path;
				}
			}
			let categoryID: any = [];
			let measurementID: any = [];
			let categoryData = await this.categoryService.findAll().then((data) => {
				data.map((id) => {
					categoryID.push(id.category_id);
				});
			});
			let measurementData = await this.measurementService.findAll().then((data) => {
				data.map((id) => {
					measurementID.push(id.measurement_id);
				});
			});
			orderData.customer_measurement.map((data) => {
				if (!categoryID.includes(data.category_id)) {
					throw new BadResponseHandler("CateGory Not Found");
				}
				if (!measurementID.includes(data.measurement_id)) {
					throw new BadResponseHandler("Measurement Not Found");
				}
			});
			let data = await this.orderService.create(orderData);

			return res.api.create(data);
		},
	};

	public edit = {
		validation: this.orderValidation.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let orderId: string = req.params["order_id"] as string;
			const orderData = new CreateOrderDTO(req.body);
			const checkOrderData = await this.orderService.findOne({ order_id: orderId });
			if (checkOrderData == null) {
				throw new BadResponseHandler("Order Data Not Found");
			}
			const file: any = req.files;
			if (file) {
				if (file.image_name) {
					let fileValidation = fileType(file.image_name, image);
					if (fileValidation === false) {
						return res.api.validationErrors({
							message: ["Invalid image_name file"],
						});
					}
					let file_path: any = await saveFile(file.image_name, "OrderImage");
					orderData.image_name = file_path.upload_path;
				}
			}
			let categoryID: any = [];
			let measurementID: any = [];
			await this.categoryService.findAll().then((data) => {
				data.map((id) => {
					categoryID.push(id.category_id);
				});
			});
			await this.measurementService.findAll().then((data) => {
				data.map((id) => {
					measurementID.push(id.measurement_id);
				});
			});
			orderData.customer_measurement.map((data) => {
				if (!categoryID.includes(data.category_id)) {
					throw new BadResponseHandler("CateGory Not Found");
				}
				if (!measurementID.includes(data.measurement_id)) {
					throw new BadResponseHandler("Measurement Not Found");
				}
			});
			let data = await this.orderService.edit(orderData, orderId, checkOrderData.customer_id);
			return res.api.create(data);
		},
	};
}
