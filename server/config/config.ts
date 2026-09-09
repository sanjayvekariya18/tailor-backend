import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

dotenv.config({ path: path.join(__dirname, "../../.env") });

// get the intended host and port number, use localhost and port 3000 if not provided
const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid("production", "development", "test").required(),
		PORT: Joi.number().default(6565),

		JWT_SECRET: Joi.string().required().description("JWT secret key"),
		JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description("minutes after which access tokens expire"),
		JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description("days after which refresh tokens expire"),

		DB_HOST: Joi.string().required().description("Database Host"),
		DB_PORT: Joi.string().required().description("Database Port"),
		DB_USERNAME: Joi.string().required().description("Database Username"),
		DB_PASSWORD: Joi.string().required().description("Database Password"),
		DB_NAME: Joi.string().required().description("Account Database Name"),
		DB_DIALECT: Joi.string().required().description("Database Dialect"),

		FILEPATH: Joi.string().default("$../../public"),
		FRONTEND_URL: Joi.string().required(),
		BACKEND_URL: Joi.string().required(),

		// Sent via Baileys (unofficial WhatsApp Web automation), not Meta's Cloud API.
		// WHATSAPP_DAILY_LIMIT is a self-imposed safety cap: past this many messages in
		// a rolling day, WhatsAppAPIService stops sending and just logs a warning, to
		// keep volume low and reduce the chance of the number being flagged/banned.
		WHATSAPP_ENABLED: Joi.boolean().default(true).description("Master on/off switch for outbound WhatsApp notifications"),
		WHATSAPP_DAILY_LIMIT: Joi.number().default(200).description("Max WhatsApp messages to send per day"),
		WHATSAPP_AUTH_DIR: Joi.string().default("baileys_auth").description("Folder to persist the Baileys login session in"),
		// Lets a non-technical shop user open a browser page to scan the WhatsApp
		// linking QR code, without ever needing server/SSH access. The page is only
		// served when this is set, and only to visitors who supply it as ?token=...
		// Leave unset to disable the page entirely.
		WHATSAPP_QR_ACCESS_TOKEN: Joi.string().optional().allow("").description("Shared secret required as ?token= to view the WhatsApp QR-linking page"),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

export = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	jwt: {
		secret: envVars.JWT_SECRET,
		accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
		refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
		resetPasswordExpirationMinutes: 10,
	},
	db: {
		host: envVars.DB_HOST,
		username: envVars.DB_USERNAME,
		password: envVars.DB_PASSWORD,
		dbname: envVars.DB_NAME,
		dialect: envVars.DB_DIALECT,
		port: envVars.DB_PORT,
	},
	sys_email_details: {
		email: envVars.SYS_EMAIL,
		password: envVars.SYS_EMAIL_PASSWORD,
	},
	file_path: envVars.FILEPATH,
	frontend_url: envVars.FRONTEND_URL,
	backend_url: envVars.BACKEND_URL,
	whatsapp: {
		enabled: envVars.WHATSAPP_ENABLED,
		daily_limit: envVars.WHATSAPP_DAILY_LIMIT,
		auth_dir: envVars.WHATSAPP_AUTH_DIR,
		qr_access_token: envVars.WHATSAPP_QR_ACCESS_TOKEN,
	},
};
