import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { WORKER_ASSIGN_TASK } from "../constants";

export interface OrderProductAttributes {
	order_product_id?: string;
	order_id: string;
	category_id: string;
	worker_id?: string;
	parent?: number;
	qty: number;
	price: number;
	status: WORKER_ASSIGN_TASK;
	work_price?: number;
	work_total?: number;
	assign_date?: Date;
}

export interface OrderProductInput
	extends Optional<OrderProductAttributes, "order_product_id" | "worker_id" | "parent" | "status" | "work_price" | "work_total" | "assign_date"> {}
export interface OrderProductOutput extends Required<OrderProductAttributes> {}

class OrderProduct extends Model<OrderProductAttributes, OrderProductInput> implements OrderProductAttributes {
	public order_product_id!: string;
	public order_id!: string;
	public category_id!: string;
	public worker_id!: string;
	public parent!: number;
	public qty!: number;
	public price!: number;
	public status!: WORKER_ASSIGN_TASK;
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
			allowNull: true,
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
			type: DataTypes.ENUM(...Object.keys(WORKER_ASSIGN_TASK)),
			defaultValue: WORKER_ASSIGN_TASK.pending,
			allowNull: false,
		},
		work_price: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		work_total: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		assign_date: {
			type: DataTypes.DATE,
			allowNull: true,
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
