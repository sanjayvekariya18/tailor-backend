import { NextFunction, Request, Response } from "express";
import { isEmpty } from "../utils/helper";
import { CustomerService } from "../services";
import { CustomerValidation } from "../validations";
import { CreateCustomerDTO, EditCustomerDTO, SearchCustomerDTO } from "../dto";
import { Op } from "sequelize";

export default class CustomerController {
	private customerService = new CustomerService();
	private customerValidation = new CustomerValidation();

	public getAll = {
		validation: this.customerValidation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.customerService.getAll(new SearchCustomerDTO(req.query));
			return res.api.create(data);
		},
	};

	public getCustomerList = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.customerService.findAll();
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.customerValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customerData = new CreateCustomerDTO(req.body);
			const checkCustomerData = await this.customerService.findOne({ customer_mobile: customerData.customer_mobile });
			if (!isEmpty(checkCustomerData)) {
				return res.api.badResponse({ message: "Customer Already Exit" });
			}
			const data = await this.customerService.create(customerData);
			return res.api.create(data);
		},
	};

	public edit = {
		validation: this.customerValidation.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customerId: string = req.params["customer_id"] as string;
			const reqCustomerData = new EditCustomerDTO(req.body);
			const checkCustomerData = await this.customerService.findOne({ customer_id: customerId });
			if (isEmpty(checkCustomerData)) {
				return res.api.badResponse({ message: "Customer Data Not Found" });
			}
			if (reqCustomerData.customer_mobile !== undefined) {
				const CheckCustomerData = await this.customerService.findOne({
					customer_mobile: reqCustomerData.customer_mobile,
					customer_id: { [Op.not]: customerId },
				});
				if (!isEmpty(CheckCustomerData)) {
					return res.api.badResponse({ message: "Customer Already Exit" });
				}
			}
			const data = await this.customerService.edit(reqCustomerData, customerId);
			return res.api.create(data);
		},
	};
}
