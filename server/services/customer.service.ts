import { Op, QueryTypes } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { Customer, CustomerMeasurement, Login } from "../models";
import { BulkCustomerMeasurementDTO, ChangeCustomerPasswordDTO, CreateCustomerDTO, EditCustomerDTO, SearchCustomerDTO } from "../dto";

export default class CustomerService {
	public getAll = async (searchParams: SearchCustomerDTO) => {
		return await Customer.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					[Op.or]: [
						{ customer_name: { [Op.like]: "%" + searchParams.searchTxt + "%" } },
						{ customer_mobile: { [Op.like]: searchParams.searchTxt + "%" } },
					],
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

	public findAll = async () => {
		return await sequelizeConnection.query(
			`
            SELECT customer_id, CONCAT(customer_name, ' - ', customer_mobile) AS customer_name FROM customer
            where customer_name is not null and customer_mobile is not null 
        `,
			{ type: QueryTypes.SELECT }
		);
	};

	public create = async (customerData: CreateCustomerDTO) => {
		return await Customer.create(customerData).then((data) => {
			return data;
		});
	};

	public edit = async (customerData: EditCustomerDTO, customer_id: number) => {
		return await Customer.update(customerData, { where: { customer_id: customer_id } }).then(() => {
			return "Customer Edited successfully";
		});
	};

	public delete = async (customer_id: number) => {
		return await Customer.destroy({ where: { customer_id: customer_id } }).then(() => {
			return "Customer deleted successfully";
		});
	};
	public changePassword = async (userData: ChangeCustomerPasswordDTO, login_id: number) => {
		return await Login.update({ password: userData.new_password }, { where: { login_id: login_id } }).then(() => {
			return "User password change successfully";
		});
	};

	public createOrEditCustomerMeasurement = async (tableData: BulkCustomerMeasurementDTO) => {
		const customer_measurement_data = await CustomerMeasurement.findAll({ where: { customer_id: tableData.customer_id } });

		for await (const measurement of tableData.measurement) {
			const customer_measurement = customer_measurement_data.find(
				(row) => row.category_id == measurement.category_id && row.measurement_id == measurement.measurement_id
			);

			if (customer_measurement) {
				customer_measurement.measurement = measurement.measurement;
				customer_measurement.measurement_2 = measurement.measurement_2;
				await customer_measurement.save();
			} else {
				await CustomerMeasurement.create(measurement).then((data) => {
					customer_measurement_data.push(data);
				});
			}
		}

		return { message: "Customer measurements updated" };
	};
}
