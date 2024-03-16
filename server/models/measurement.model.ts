import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface MeasurementAttributes {
	measurement_id?: string;
	category_id: string;
	measurement_name: string;
}

export interface MeasurementInput extends Optional<MeasurementAttributes, "measurement_id"> {}
export interface MeasurementOutput extends Required<MeasurementAttributes> {}

class Measurement extends Model<MeasurementAttributes, MeasurementInput> implements MeasurementAttributes {
	public measurement_id!: string;
	public category_id!: string;
	public measurement_name!: string;
}

Measurement.init(
	{
		measurement_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		category_id: {
			type: DataTypes.UUID,
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
