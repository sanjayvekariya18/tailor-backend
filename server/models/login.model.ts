import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface LoginAttributes {
	login_id?: number;
	user_name: string;
	password: string;
	address: string;
	mobile_no: string;
	logo: string;
	whatsapp_id: string;
	whatsapp_token: string;
}

export interface LoginInput extends Optional<LoginAttributes, "login_id"> {}
export interface LOginOutput extends Required<LoginAttributes> {}

class Login extends Model<LoginAttributes, LoginInput> implements LoginAttributes {
	public login_id!: number;
	public user_name!: string;
	public password!: string;
	public address!: string;
	public mobile_no!: string;
	public logo!: string;
	public whatsapp_id!: string;
	public whatsapp_token!: string;
}

Login.init(
	{
		login_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		user_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mobile_no: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		logo: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		whatsapp_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		whatsapp_token: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `login`,
	}
);

export default Login;
