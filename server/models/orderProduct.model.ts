import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface OrderProductAttributes {
	order_product_id?: string;
	order_id: string;
	worker_id: string;
	category_id: string;
	parent?: number;
	qty: number;
	price: number;
	status?: boolean;
	work_price: number;
	work_total: number;
	assign_date: Date;
}

export interface OrderProductInput extends Optional<OrderProductAttributes, "order_product_id" | "parent" | "status"> {}
export interface OrderProductOutput extends Required<OrderProductAttributes> {}

class OrderProduct extends Model<OrderProductAttributes, OrderProductInput> implements OrderProductAttributes {
	public order_product_id!: string;
	public order_id!: string;
	public worker_id!: string;
	public category_id!: string;
	public parent!: number;
	public qty!: number;
	public price!: number;
	public status!: boolean;
	public work_price!: number;
	public work_total!: number;
	public assign_date!: Date;
}

OrderProduct.init(
	{
		order_product_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		order_id: {
			type: DataTypes.UUID,
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
		worker_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: {
					tableName: "worker",
				},
				key: "worker_id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},

		parent: {
			defaultValue: 0,
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		qty: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			defaultValue: false,
			type: DataTypes.STRING,
			allowNull: true,
		},
		work_price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		work_total: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		assign_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `order_product`,
	}
);

export default OrderProduct;
