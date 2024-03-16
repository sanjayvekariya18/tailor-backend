import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface CategoryAttributes {
	category_id?: string;
	category_name: string;
	category_image: string;
}

export interface CategoryInput extends Optional<CategoryAttributes, "category_id"> {}
export interface CategoryOutput extends Required<CategoryAttributes> {}

class Category extends Model<CategoryAttributes, CategoryInput> implements CategoryAttributes {
	public category_id!: string;
	public category_name!: string;
	public category_image!: string;
}

Category.init(
	{
		category_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		category_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		category_image: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `category`,
	}
);

export default Category;
