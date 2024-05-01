import { NextFunction, Request, Response } from "express";
import { fileType, removeFile, saveFile } from "../utils/helper";
import { OrderValidation } from "../validations";
import { CategoryService, MeasurementService, OrderService } from "../services";
import { CreateOrderDTO, SearchDeliveryOrderRemainDTO, SearchOrderDTO } from "../dto";
import { image } from "../constants";
import { BadResponseHandler, FormErrorsHandler } from "../errorHandler";
import { OrderPaymentDTO, findCustomerMeasurementDTO, getCustomerBillDTO, getCustomerPaymentDataDTO } from "../dto/order.dto";
import moment from "moment";
import { Category, ChestDetails, Measurement, OrderImages } from "../models";

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

	public getCustomerMeasurement = {
		validation: this.orderValidation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const orderId: number = Number((req.params["order_id"] as string) || 0);
			const checkOrderData = await this.orderService.findOne({ order_id: orderId });
			if (checkOrderData == null) {
				throw new BadResponseHandler("Order Data Not Found");
			}
			const data: any = await this.orderService.getCustomerMeasurement(orderId);
			const customerMeasurementData = data?.get({ plain: true }).Customer.CustomerMeasurements;
			let CustomerChestDetails = [];

			const measurementCH = customerMeasurementData.find((item: any) => item.Measurement.measurement_name === "CH");
			if (measurementCH != undefined) {
				if (measurementCH.measurement !== null) {
					let measurementData = await ChestDetails.findOne({ where: { chest: measurementCH.measurement }, raw: true });
					if (measurementData !== null) {
						CustomerChestDetails.push(measurementData);
					}
				}
			}
			return res.api.create({ ...data.get({ plain: true }), CustomerChestDetails });
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
			const orderId: number = Number((req.params["id"] as string) || 0);
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

			const errors: any = {};

			const category_ids: Array<number> = [];
			orderData.order_details.forEach((row) => {
				if (!category_ids.includes(row.category_id)) {
					category_ids.push(row.category_id);
				}
			});
			const measurement_ids: Array<number> = [];
			orderData.customer_measurement.forEach((row) => {
				if (!measurement_ids.includes(row.measurement_id)) {
					measurement_ids.push(row.measurement_id);
				}
			});
			const measurement_category_ids: Array<number> = [];
			orderData.customer_measurement.forEach((row) => {
				if (!measurement_category_ids.includes(row.category_id)) {
					measurement_category_ids.push(row.category_id);
				}
			});
			const category_data = await Category.findAll().then((data) => data.map((row) => row.category_id));
			const measurement_data = await Measurement.findAll().then((data) => data.map((row) => row.measurement_id));

			if (category_data.filter((row) => category_ids.includes(row)).length != category_ids.length) {
				this.pushErrors(errors, "order_details", `Some category not found`);
			}

			if (category_data.filter((row) => measurement_category_ids.includes(row)).length != measurement_category_ids.length) {
				this.pushErrors(errors, "customer_measurement", `Some category not found`);
			}

			if (measurement_data.filter((row) => measurement_ids.includes(row)).length != measurement_ids.length) {
				this.pushErrors(errors, "customer_measurement", `Some measurement not found`);
			}

			const file: any = req.files;
			if (file) {
				if (!Array.isArray(file[`image_name[]`])) {
					let fileValidation = fileType(file[`image_name[]`], image);
					if (fileValidation === false) {
						this.pushErrors(errors, "image", `Invalid image_name file`);
					} else {
						let file_path: any = await saveFile(file[`image_name[]`], "OrderImage");
						orderData.image_name.push(file_path.upload_path);
					}
				} else {
					for (const image_name of file[`image_name[]`]) {
						let fileValidation = fileType(image_name, image);
						if (fileValidation === false) {
							this.pushErrors(errors, "image", `Invalid image_name file`);
						}
					}
					if (errors.image?.length == 0) {
						for (const image_name of file[`image_name[]`]) {
							let file_path: any = await saveFile(image_name, "OrderImage");
							orderData.image_name.push(file_path.upload_path);
						}
					}
				}
			}

			if (Object.keys(errors).length > 0) {
				throw new FormErrorsHandler(errors);
			}

			let data = await this.orderService.create(orderData);
			return res.api.create(data);
		},
	};

	private pushErrors = (errors: any, key: string, message: string) => {
		if (!errors[`${key}`]) {
			errors[`${key}`] = [];
		}
		errors[`${key}`].push(message);
	};

	public edit = {
		validation: this.orderValidation.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const orderId: number = Number((req.params["order_id"] as string) || 0);
			const orderData = new CreateOrderDTO(req.body);
			const checkOrderData = await this.orderService.findOne({ order_id: orderId });
			if (checkOrderData == null) {
				throw new BadResponseHandler("Order data not found");
			}

			const errors: any = {};

			const category_ids: Array<number> = [];
			orderData.order_details.forEach((row) => {
				if (!category_ids.includes(row.category_id)) {
					category_ids.push(row.category_id);
				}
			});
			const measurement_ids: Array<number> = [];
			orderData.customer_measurement.forEach((row) => {
				if (!measurement_ids.includes(row.measurement_id)) {
					measurement_ids.push(row.measurement_id);
				}
			});
			const measurement_category_ids: Array<number> = [];
			orderData.customer_measurement.forEach((row) => {
				if (!measurement_category_ids.includes(row.category_id)) {
					measurement_category_ids.push(row.category_id);
				}
			});
			const category_data = await Category.findAll().then((data) => data.map((row) => row.category_id));
			const measurement_data = await Measurement.findAll().then((data) => data.map((row) => row.measurement_id));

			if (category_data.filter((row) => category_ids.includes(row)).length != category_ids.length) {
				this.pushErrors(errors, "order_details", `Some category not found`);
			}

			if (category_data.filter((row) => measurement_category_ids.includes(row)).length != measurement_category_ids.length) {
				this.pushErrors(errors, "customer_measurement", `Some category not found`);
			}

			if (measurement_data.filter((row) => measurement_ids.includes(row)).length != measurement_ids.length) {
				this.pushErrors(errors, "customer_measurement", `Some measurement not found`);
			}

			const file: any = req.files;
			if (file) {
				if (!Array.isArray(file[`image_name[]`])) {
					let fileValidation = fileType(file[`image_name[]`], image);
					if (fileValidation === false) {
						this.pushErrors(errors, "image", `Invalid image_name file`);
					} else {
						let file_path: any = await saveFile(file[`image_name[]`], "OrderImage");
						orderData.image_name.push(file_path.upload_path);
					}
				} else {
					for (const image_name of file[`image_name[]`]) {
						let fileValidation = fileType(image_name, image);
						if (fileValidation === false) {
							this.pushErrors(errors, "image", `Invalid image_name file`);
						}
					}
					if (errors.image?.length == 0) {
						for (const image_name of file[`image_name[]`]) {
							let file_path: any = await saveFile(image_name, "OrderImage");
							orderData.image_name.push(file_path.upload_path);
						}
					}
				}
			}

			if (Object.keys(errors).length > 0) {
				throw new FormErrorsHandler(errors);
			}

			let data = await this.orderService.edit(orderData, orderId, checkOrderData.customer_id);
			return res.api.create(data);
		},
	};

	public payment = {
		validation: this.orderValidation.OrderPayment,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const orderId: number = Number((req.params["order_id"] as string) || 0);
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
			const orderId: number = Number((req.params["order_id"] as string) || 0);
			const checkOrderDataId = await this.orderService.findOne({ order_id: orderId });
			if (checkOrderDataId == null) {
				return res.api.badResponse({ message: "Order Not Found" });
			}
			let data = await this.orderService.delete(orderId);
			return res.api.create(data);
		},
	};

	public order_image_delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const orderImageId: number = Number((req.params["order_image_id"] as string) || 0);
			const checkOrderImageId = await OrderImages.findOne({ where: { order_image_id: orderImageId } });
			if (checkOrderImageId != null) {
				checkOrderImageId.image_name && (await removeFile(checkOrderImageId.image_name));
				await this.orderService.deletedImage(orderImageId);
			}
			return res.api.create({
				message: "Image deleted",
			});
		},
	};
}
