import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface OrderImagesAttributes {
	order_image_id?: string;
	order_id: string;
	image_name: string;
}

export interface OrderImagesInput extends Optional<OrderImagesAttributes, "order_image_id"> {}
export interface OrderImagesOutput extends Required<OrderImagesAttributes> {}

class OrderImages extends Model<OrderImagesAttributes, OrderImagesInput> implements OrderImagesAttributes {
	public order_image_id!: string;
	public order_id!: string;
	public image_name!: string;
}

OrderImages.init(
	{
		order_image_id: {
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
