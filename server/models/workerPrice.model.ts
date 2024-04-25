import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface WorkerPriceAttributes {
	worker_price_id?: number;
	worker_id: number;
	category_id: number;
	price: number;
}

export interface WorkerPriceInput extends Optional<WorkerPriceAttributes, "worker_price_id"> {}
export interface WorkerPriceOutput extends Required<WorkerPriceAttributes> {}

class WorkerPrice extends Model<WorkerPriceAttributes, WorkerPriceInput> implements WorkerPriceAttributes {
	public worker_price_id!: number;
	public worker_id!: number;
	public category_id!: number;
	public price!: number;
}

WorkerPrice.init(
	{
		worker_price_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		worker_id: {
			type: DataTypes.INTEGER,
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
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `worker_price`,
	}
);

export default WorkerPrice;
