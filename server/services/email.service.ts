import nodemailer, { Transporter } from "nodemailer";
import { config, logger } from "../config";
import path from "path";
const fs = require("fs");

interface EmailData {
	to: string;
	subject: string;
	html: string;
}

export default class EmailService {
	private transporter: Transporter | null = null;

	constructor() {
		const user = config.sys_email_details.email;
		const pass = config.sys_email_details.password;
		if (!user || !pass) {
			logger.warn("SYS_EMAIL / SYS_EMAIL_PASSWORD not configured — outbound email is disabled.");
			return;
		}

		this.transporter = nodemailer.createTransport(
			{
				service: "Gmail",
				auth: {
					user,
					pass,
				},
			},
			{
				from: user,
			}
		);
	}

	private sendEmail = async (emailData: EmailData) => {
		if (!this.transporter) {
			logger.warn(`Email skipped (transporter not configured): ${emailData.subject}`);
			return;
		}

		return await this.transporter.sendMail(emailData).catch((error: any) => {
			const authFailed = error?.code === "EAUTH" || error?.responseCode === 535;
			if (authFailed) {
				logger.error(
					"Email auth failed (Gmail rejected SYS_EMAIL / SYS_EMAIL_PASSWORD). Update the Gmail App Password in .env — backups and mail notifications will keep failing until then."
				);
				return;
			}
			logger.error(`Error sending email: ${error?.message || error}`);
		});
	};

	public dailyDatabaseBackupFileSendEmail = async (file_path: string, to: string, dbName: string) => {
		const emailHtml = `
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td><p>This is Daily BackUp of DataBase - ${dbName}</p></td>
            </tr>
        </table>`;
		const filePath = path.join(__dirname, `../../public/databaseBackUp/${file_path}.gz`);
		const fileContent = fs.readFileSync(filePath);

		let emailData: any = {
			html: emailHtml,
			subject: `BackUp DataBase of ${dbName} on ${file_path}`,
			to,
			attachments: [
				{
					filename: file_path + ".gz",
					content: fileContent,
				},
			],
		};
		await this.sendEmail(emailData);
	};
}
