import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface CustomerMeasurementAttributes {
	cm_id?: string;
	customer_id: string;
	category_id: string;
	measurement_id: string;
	measurement: string;
	measurement_2?: string;
}

export interface CustomerMeasurementInput extends Optional<CustomerMeasurementAttributes, "cm_id" | "measurement_2"> {}
export interface CustomerMeasurementOutput extends Required<CustomerMeasurementAttributes> {}

class CustomerMeasurement extends Model<CustomerMeasurementAttributes, CustomerMeasurementInput> implements CustomerMeasurementAttributes {
	public cm_id!: string;
	public customer_id!: string;
	public category_id!: string;
	public measurement_id!: string;
	public measurement!: string;
	public measurement_2!: string;
}

CustomerMeasurement.init(
	{
		cm_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		customer_id: {
			type: DataTypes.UUID,
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
			type: DataTypes.UUID,
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
			type: DataTypes.UUID,
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
