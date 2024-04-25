import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface DeliveryAttributes {
	delivery_id?: number;
	order_id: number;
	date: Date;
	delivered_to: string;
	delivered_mo?: string;
	total_delivered: number;
	note: string;
}

export interface DeliveryInput extends Optional<DeliveryAttributes, "delivery_id" | "delivered_mo"> {}
export interface DeliveryOutput extends Required<DeliveryAttributes> {}

class Delivery extends Model<DeliveryAttributes, DeliveryInput> implements DeliveryAttributes {
	public delivery_id!: number;
	public order_id!: number;
	public date!: Date;
	public delivered_to!: string;
	public delivered_mo!: string;
	public total_delivered!: number;
	public note!: string;
}

Delivery.init(
	{
		delivery_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		order_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: "order",
				},
				key: "order_id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		delivered_to: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		delivered_mo: {
			defaultValue: null,
			type: DataTypes.TEXT,
		},
		total_delivered: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		note: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `delivery`,
	}
);

export default Delivery;
