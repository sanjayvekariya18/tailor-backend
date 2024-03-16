import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface WorkerAttributes {
	worker_id?: string;
	worker_name: string;
	worker_mobile: string;
	worker_address: string;
	worker_photo: string;
	worker_proof: string;
}

export interface WorkerInput extends Optional<WorkerAttributes, "worker_id"> {}
export interface WorkerOutput extends Required<WorkerAttributes> {}

class Worker extends Model<WorkerAttributes, WorkerInput> implements WorkerAttributes {
	public worker_id!: string;
	public worker_name!: string;
	public worker_mobile!: string;
	public worker_address!: string;
	public worker_photo!: string;
	public worker_proof!: string;
}

Worker.init(
	{
		worker_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		worker_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		worker_mobile: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		worker_address: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		worker_photo: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		worker_proof: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `worker`,
	}
);

export default Worker;
