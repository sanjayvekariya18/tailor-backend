import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface PurchasePaymentAttributes {
	Purchase_payment_id?: number;
	purchase_id: number;
	amount: number;
	payment_date: Date;
}

export interface PurchasePaymentInput extends Optional<PurchasePaymentAttributes, "Purchase_payment_id"> {}
export interface PurchasePaymentOutput extends Required<PurchasePaymentAttributes> {}

class PurchasePayment extends Model<PurchasePaymentAttributes, PurchasePaymentInput> implements PurchasePaymentAttributes {
	public Purchase_payment_id!: number;
	public purchase_id!: number;
	public amount!: number;
	public payment_date!: Date;
}

PurchasePayment.init(
	{
		Purchase_payment_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		purchase_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: "purchase",
				},
				key: "purchase_id",
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
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `purchase_payment`,
	}
);

export default PurchasePayment;
