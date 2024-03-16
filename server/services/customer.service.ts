import { Op } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { Customer } from "../models";
import { CreateCustomerDTO, EditCustomerDTO } from "../dto";

export default class CustomerService {
	public getAll = async (searchParams: any) => {
		return await Customer.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					customer_name: { [Op.like]: "%" + searchParams.searchTxt + "%" },
				}),
			},
			attributes: ["customer_id", "customer_name", "customer_mobile", "customer_address"],
			order: [["customer_name", "ASC"]],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public findOne = async (searchObject: any) => {
		return await Customer.findOne({
			where: {
				...searchObject,
			},
			attributes: ["customer_id", "customer_name", "customer_mobile", "customer_address"],
			raw: true,
		});
	};

	public create = async (customerData: CreateCustomerDTO) => {
		return await Customer.create(customerData).then((data) => {
			return data;
		});
	};

	public edit = async (customerData: EditCustomerDTO, customer_id: string) => {
		return await Customer.update(customerData, { where: { customer_id: customer_id } }).then(() => {
			return "Customer Edited successfully";
		});
	};
}
