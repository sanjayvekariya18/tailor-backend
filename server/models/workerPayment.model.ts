import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface WorkerPaymentAttributes {
	worker_payment_id?: number;
	worker_id: number;
	amount: number;
	payment_date: Date;
	type: number;
}

export interface WorkerPaymentInput extends Optional<WorkerPaymentAttributes, "worker_payment_id"> {}
export interface WorkerPaymentOutput extends Required<WorkerPaymentAttributes> {}

class WorkerPayment extends Model<WorkerPaymentAttributes, WorkerPaymentInput> implements WorkerPaymentAttributes {
	public worker_payment_id!: number;
	public worker_id!: number;
	public amount!: number;
	public payment_date!: Date;
	public type!: number;
}

WorkerPayment.init(
	{
		worker_payment_id: {
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
		amount: {
			type: DataTypes.REAL,
			allowNull: false,
		},
		payment_date: {
			type: DataTypes.DATE,
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
		tableName: `worker_payment`,
	}
);

export default WorkerPayment;
