import { NextFunction, Request, Response } from "express";
import { isEmpty } from "../utils/helper";
import { CustomerService } from "../services";
import { CustomerValidation } from "../validations";
import { BulkCustomerMeasurementDTO, ChangeCustomerPasswordDTO, CreateCustomerDTO, EditCustomerDTO, SearchCustomerDTO } from "../dto";
import { Op } from "sequelize";
import { Login } from "../models";
import { BadResponseHandler } from "../errorHandler";

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
			const customerId: number = Number((req.params["customer_id"] as string) || 0);
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

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customerId: number = Number((req.params["customer_id"] as string) || 0);
			const checkCustomerData = await this.customerService.findOne({ customer_id: customerId });
			if (isEmpty(checkCustomerData)) {
				return res.api.badResponse({ message: "Customer data Not Found" });
			}
			const data = await this.customerService.delete(customerId);
			return res.api.create(data);
		},
	};

	public changePassword = {
		validation: this.customerValidation.changePassword,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const userId: number = Number((req.params["login_id"] as string) || 0);
			const userData = new ChangeCustomerPasswordDTO(req.body);
			const checkLoginData = await Login.findOne({ where: { login_id: userId } });
			if (isEmpty(checkLoginData)) {
				return res.api.badResponse({ message: "User data not found" });
			}
			if (userData.old_password == checkLoginData?.password) {
				if (userData.new_password == userData.confirm_password) {
					let data = await this.customerService.changePassword(userData, userId);
					return res.api.create(data);
				} else {
					throw new BadResponseHandler("new password not match conform password");
				}
			} else {
				throw new BadResponseHandler("old password not match");
			}
		},
	};

	public createOrEditCustomerMeasurement = {
		validation: this.customerValidation.createOrEditCustomerMeasurement,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.customerService.createOrEditCustomerMeasurement(new BulkCustomerMeasurementDTO(req.body));
			return res.api.create(data);
		},
	};
}
