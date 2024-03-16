import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface OrderAttributes {
	order_id?: string;
	customer_id: string;
	total: number;
	payment?: number;
	order_date: Date;
	delivery_date: Date;
	shirt_pocket: number;
	pant_pocket: number;
	pant_pinch: number;
	type: number;
}

export interface OrderInput extends Optional<OrderAttributes, "order_id" | "payment"> {}
export interface OrderOutput extends Required<OrderAttributes> {}

class Order extends Model<OrderAttributes, OrderInput> implements OrderAttributes {
	public order_id!: string;
	public customer_id!: string;
	public total!: number;
	public payment!: number;
	public order_date!: Date;
	public delivery_date!: Date;
	public shirt_pocket!: number;
	public pant_pocket!: number;
	public pant_pinch!: number;
	public type!: number;
}

Order.init(
	{
		order_id: {
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
		total: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		payment: {
			defaultValue: 0,
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		order_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		delivery_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		shirt_pocket: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		pant_pocket: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		pant_pinch: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		type: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `order`,
	}
);

export default Order;
