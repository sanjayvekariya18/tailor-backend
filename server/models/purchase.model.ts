import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface PurchaseAttributes {
	purchase_id?: string;
	party_name: string;
	amount: number;
	payment?: number;
	outstand: number;
	details?: string;
	challan?: string;
	purchase_date: Date;
}

export interface PurchaseInput extends Optional<PurchaseAttributes, "purchase_id" | "payment" | "details" | "challan"> {}
export interface PurchaseOutput extends Required<PurchaseAttributes> {}

class Purchase extends Model<PurchaseAttributes, PurchaseInput> implements PurchaseAttributes {
	public purchase_id!: string;
	public party_name!: string;
	public amount!: number;
	public payment!: number;
	public outstand!: number;
	public details!: string;
	public challan!: string;
	public purchase_date!: Date;
}

Purchase.init(
	{
		purchase_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		party_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		payment: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		outstand: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		details: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		challan: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		purchase_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `purchase`,
	}
);

export default Purchase;
