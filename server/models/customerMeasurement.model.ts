import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface CustomerMeasurementAttributes {
	cm_id?: number;
	customer_id: number;
	category_id: number;
	measurement_id: number;
	measurement: string;
	measurement_2?: string;
}

export interface CustomerMeasurementInput extends Optional<CustomerMeasurementAttributes, "cm_id" | "measurement_2"> {}
export interface CustomerMeasurementOutput extends Required<CustomerMeasurementAttributes> {}

class CustomerMeasurement extends Model<CustomerMeasurementAttributes, CustomerMeasurementInput> implements CustomerMeasurementAttributes {
	public cm_id!: number;
	public customer_id!: number;
	public category_id!: number;
	public measurement_id!: number;
	public measurement!: string;
	public measurement_2!: string;
}

CustomerMeasurement.init(
	{
		cm_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		customer_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: "customer",
				},
				key: "customer_id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		category_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: "category",
				},
				key: "category_id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		measurement_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: "measurement",
				},
				key: "measurement_id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		measurement: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		measurement_2: {
			defaultValue: null,
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `customer_measurement`,
	}
);

export default CustomerMeasurement;
