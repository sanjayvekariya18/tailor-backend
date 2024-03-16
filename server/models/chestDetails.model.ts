import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface ChestDetailsAttributes {
	chest_id?: string;
	chest: string;
	mudho_golai: string;
	mudho: string;
	cross_bay: string;
	ba_mudho_down: string;
	so_down: string;
}

export interface ChestDetailsInput extends Optional<ChestDetailsAttributes, "chest_id"> {}
export interface ChestDetailsOutput extends Required<ChestDetailsAttributes> {}

class ChestDetails extends Model<ChestDetailsAttributes, ChestDetailsInput> implements ChestDetailsAttributes {
	public chest_id!: string;
	public chest!: string;
	public mudho_golai!: string;
	public mudho!: string;
	public cross_bay!: string;
	public ba_mudho_down!: string;
	public so_down!: string;
}

ChestDetails.init(
	{
		chest_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		chest: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mudho_golai: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mudho: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		cross_bay: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ba_mudho_down: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		so_down: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `chest_Details`,
	}
);

export default ChestDetails;
