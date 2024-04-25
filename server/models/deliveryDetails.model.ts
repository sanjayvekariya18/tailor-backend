import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface DeliveryDetailsAttributes {
	delivery_details_id?: number;
	delivery_id: number;
	category_id: number;
	qty: number;
}

export interface DeliveryDetailsInput extends Optional<DeliveryDetailsAttributes, "delivery_details_id"> {}
export interface DeliveryDetailsOutput extends Required<DeliveryDetailsAttributes> {}

class DeliveryDetails extends Model<DeliveryDetailsAttributes, DeliveryDetailsInput> implements DeliveryDetailsAttributes {
	public delivery_details_id!: number;
	public delivery_id!: number;
	public category_id!: number;
	public qty!: number;
}

DeliveryDetails.init(
	{
		delivery_details_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		delivery_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: "delivery",
				},
				key: "delivery_id",
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
		qty: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `delivery_details`,
	}
);

export default DeliveryDetails;
