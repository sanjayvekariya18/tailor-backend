import { NextFunction, Request, Response } from "express";
import { CategoryService, DeliveryService, OrderService } from "../services";
import { DeliveryValidation } from "../validations";
import { CreateDeliveryDTO, EditDeliveryDTO, SearchDeliveryDTO } from "../dto";
import { isEmpty } from "lodash";
import { BadResponseHandler } from "../errorHandler";

export default class DeliveryController {
	private deliveryService = new DeliveryService();
	private deliveryValidation = new DeliveryValidation();
	private categoryService = new CategoryService();
	private orderService = new OrderService();

	public getAll = {
		validation: this.deliveryValidation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.deliveryService.getAll(new SearchDeliveryDTO(req.query));
			return res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const deliveryId: string = req.params["delivery_id"] as string;
			const data = await this.deliveryService.findOne({ delivery_id: deliveryId });
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.deliveryValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const deliveryData = new CreateDeliveryDTO(req.body);
			let categoryID: any = [];
			await this.categoryService.findAll().then((data) => {
				data.map((id) => {
					categoryID.push(id.category_id);
				});
			});

			deliveryData.delivery_details.map((data) => {
				if (!categoryID.includes(data.category_id)) {
					throw new BadResponseHandler("Category not found");
				}
			});
			const data = await this.deliveryService.create(deliveryData);
			return res.api.create(data);
		},
	};

	public edit = {
		validation: this.deliveryValidation.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const deliveryId: number = Number((req.params["delivery_id"] as string) || 0);

			const reqDeliveryData = new EditDeliveryDTO(req.body);
			const checkDeliveryData = await this.deliveryService.findOne({ delivery_id: deliveryId });
			if (isEmpty(checkDeliveryData)) {
				return res.api.badResponse({ message: "Delivery data not found" });
			}
			const data = await this.deliveryService.edit(reqDeliveryData, deliveryId);
			return res.api.create(data);
		},
	};

	public findAllCompletedTask = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const orderId: number = Number((req.params["order_id"] as string) || 0);
			const checkOrderData = await this.orderService.findOne({ order_id: orderId });
			if (checkOrderData == null) {
				throw new BadResponseHandler("Order Data Not Found");
			}
			const data = await this.deliveryService.findAllCompletedTask(orderId);
			return res.api.create(data);
		},
	};
}
