import nodemailer, { Transporter } from "nodemailer";
import { config } from "../config";
import path from "path";
const fs = require("fs");

interface EmailData {
	to: string;
	subject: string;
	html: string;
}

export default class EmailService {
	private transporter: Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport(
			{
				service: "Gmail", // E.g., 'Gmail' for Gmail
				auth: {
					user: config.sys_email_details.email, // Your gmail address.
					pass: config.sys_email_details.password,
				},
			},
			{
				from: config.sys_email_details.email,
			}
		);
	}

	private sendEmail = async (emailData: EmailData) => {
		// Send the email
		return await this.transporter.sendMail(emailData).catch((error) => {
			console.error("Error sending email: ", error);
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
