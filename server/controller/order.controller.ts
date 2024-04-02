import { NextFunction, Request, Response } from "express";
import { fileType, saveFile } from "../utils/helper";
import { OrderValidation } from "../validations";
import { CategoryService, MeasurementService, OrderService } from "../services";
import { CreateOrderDTO, SearchDeliveryOrderRemainDTO, SearchOrderDTO } from "../dto";
import { image } from "../constants";
import { BadResponseHandler } from "../errorHandler";
import { OrderPaymentDTO, SearchOrderBillDTO, findCustomerMeasurementDTO, getCustomerBillDTO, getCustomerPaymentDataDTO } from "../dto/order.dto";
import moment from "moment";

export default class OrderController {
	private orderService = new OrderService();
	private categoryService = new CategoryService();
	private measurementService = new MeasurementService();
	private orderValidation = new OrderValidation();

	public getAll = {
		validation: this.orderValidation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.orderService.getAll(new SearchOrderDTO(req.query));
			return res.api.create(data);
		},
	};

	public findOneCustomerMeasurement = {
		validation: this.orderValidation.findOneMeasurement,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.orderService.findOneCustomerMeasurement(new findCustomerMeasurementDTO(req.query));
			return res.api.create(data);
		},
	};

	public getOrderDetails = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let orderId: string = req.params["id"] as string;
			const data = await this.orderService.getOrderDetails(orderId);
			return res.api.create(data);
		},
	};

	public getCustomerBill = {
		validation: this.orderValidation.getCustomerBill,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.orderService.getCustomerBill(new getCustomerBillDTO(req.query));
			return res.api.create(data);
		},
	};

	public deliveryOrderRemain = {
		validation: this.orderValidation.deliveryDateRemain,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.orderService.deliveryOrderRemain(new SearchDeliveryOrderRemainDTO(req.query));
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

	public payment = {
		validation: this.orderValidation.OrderPayment,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let orderId: string = req.params["order_id"] as string;
			const orderData = new OrderPaymentDTO(req.body);
			const checkOrderData = await this.orderService.findOne({ order_id: orderId });
			if (checkOrderData == null) {
				throw new BadResponseHandler("Order Data Not Found");
			}
			let todayDate = moment().format("YYYY-MM-DD");
			let payment_date = moment(orderData.payment_date).format("YYYY-MM-DD");
			let order_date = moment(checkOrderData.order_date).format("YYYY-MM-DD");
			if (todayDate < payment_date) {
				throw new BadResponseHandler("Payment date greater then today date");
			}
			if (order_date > payment_date) {
				throw new BadResponseHandler("Payment date less then order date");
			}
			let data = await this.orderService.payment(orderData, orderId);
			return res.api.create(data);
		},
	};

	public getCustomerPaymentData = {
		validation: this.orderValidation.getCustomerPaymentData,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.orderService.getCustomerPaymentData(new getCustomerPaymentDataDTO(req.query));
			return res.api.create(data);
		},
	};

	public income = {
		validation: this.orderValidation.getCustomerPaymentData,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.orderService.income(new getCustomerPaymentDataDTO(req.query));
			return res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const orderId: string = req.params["order_id"] as string;
			const checkOrderDataId = await this.orderService.findOne({ order_id: orderId });
			if (checkOrderDataId == null) {
				return res.api.badResponse({ message: "Order Not Found" });
			}
			let data = await this.orderService.delete(orderId);
			return res.api.create(data);
		},
	};
}
