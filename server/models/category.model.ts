import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export enum CATEGORY_TYPE {
	top = "top",
	bottom = "bottom",
}

export interface CategoryAttributes {
	category_id?: number;
	category_name: string;
	category_type: CATEGORY_TYPE;
	category_image: string;
	is_active?: boolean;
}

export interface CategoryInput extends Optional<CategoryAttributes, "category_id" | "is_active"> {}
export interface CategoryOutput extends Required<CategoryAttributes> {}

class Category extends Model<CategoryAttributes, CategoryInput> implements CategoryAttributes {
	public category_id!: number;
	public category_name!: string;
	public category_type!: CATEGORY_TYPE;
	public category_image!: string;
	public is_active!: boolean;
}

Category.init(
	{
		category_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		category_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		category_type: {
			type: DataTypes.ENUM(...Object.keys(CATEGORY_TYPE)),
			allowNull: false,
		},
		category_image: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
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
