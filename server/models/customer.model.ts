import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface CustomerAttributes {
	customer_id?: number;
	customer_name: string;
	customer_mobile: string;
	customer_address: string;
}

export interface CustomerInput extends Optional<CustomerAttributes, "customer_id" | "customer_address"> {}
export interface CustomerOutput extends Required<CustomerAttributes> {}

class Customer extends Model<CustomerAttributes, CustomerInput> implements CustomerAttributes {
	public customer_id!: number;
	public customer_name!: string;
	public customer_mobile!: string;
	public customer_address!: string;
}

Customer.init(
	{
		customer_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		customer_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		customer_mobile: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		customer_address: {
			type: DataTypes.TEXT,
			defaultValue: "",
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `customer`,
	}
);

export default Customer;
