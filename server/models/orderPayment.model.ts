import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface OrderPaymentAttributes {
	order_payment_id?: string;
	order_id: string;
	amount: number;
	payment_date: Date;
}

export interface OrderPaymentInput extends Optional<OrderPaymentAttributes, "order_payment_id"> {}
export interface OrderPaymentOutput extends Required<OrderPaymentAttributes> {}

class OrderPayment extends Model<OrderPaymentAttributes, OrderPaymentInput> implements OrderPaymentAttributes {
	public order_image_id!: string;
	public order_id!: string;
	public amount!: number;
	public payment_date!: Date;
}

OrderPayment.init(
	{
		order_payment_id: {
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
		tableName: `order_payments`,
	}
);

export default OrderPayment;
