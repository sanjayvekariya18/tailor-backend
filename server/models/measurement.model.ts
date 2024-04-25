import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface MeasurementAttributes {
	measurement_id?: number;
	category_id: number;
	measurement_name: string;
}

export interface MeasurementInput extends Optional<MeasurementAttributes, "measurement_id"> {}
export interface MeasurementOutput extends Required<MeasurementAttributes> {}

class Measurement extends Model<MeasurementAttributes, MeasurementInput> implements MeasurementAttributes {
	public measurement_id!: number;
	public category_id!: number;
	public measurement_name!: string;
}

Measurement.init(
	{
		measurement_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		category_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: "category",
				},
				key: "category_id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		measurement_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `measurement`,
	}
);

export default Measurement;
