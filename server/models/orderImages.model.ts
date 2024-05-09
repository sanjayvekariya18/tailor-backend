import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface OrderImagesAttributes {
	order_image_id?: number;
	order_id: number;
	image_name: string;
}

export interface OrderImagesInput extends Optional<OrderImagesAttributes, "order_image_id"> {}
export interface OrderImagesOutput extends Required<OrderImagesAttributes> {}

class OrderImages extends Model<OrderImagesAttributes, OrderImagesInput> implements OrderImagesAttributes {
	public order_image_id!: number;
	public order_id!: number;
	public image_name!: string;
}

OrderImages.init(
	{
		order_image_id: {
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
					tableName: "orders",
				},
				key: "order_id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		image_name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `order_images`,
	}
);

export default OrderImages;
