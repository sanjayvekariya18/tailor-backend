import moment from "moment";
import { config } from "../config";
import path from "path";
import { sqlFileToZip } from "../utils/helper";
import EmailService from "./email.service";
import mysqldump from "mysqldump";
import fs from "fs";

export default class DatabaseBackupService {
	private static emailService = new EmailService();
	public static dbBackup = async () => {
		const databaseName = config.db.dbname as string;
		const username = config.db.username as string;
		const databaseHost = config.db.host;
		const dbPassword = config.db.password;
		const file_name = moment().format("YYYYMMDD");

		const backupDirectory = path.join(__dirname, "./../../public/databaseBackUp/");
		if (!fs.existsSync(backupDirectory)) {
			fs.mkdirSync(backupDirectory, { recursive: true });
			console.log(`Folder created: ${backupDirectory}`);
		}
		const dumpFilePath = path.join(backupDirectory, `${file_name}.sql`);
		const sendEmail = "dhruval@karmadhi.com";

		mysqldump({
			connection: {
				host: databaseHost,
				user: username,
				password: dbPassword,
				database: databaseName,
			},
			dumpToFile: dumpFilePath,
		}).then(async () => {
			sqlFileToZip(dumpFilePath, backupDirectory, `${file_name}.sql`);
			await this.emailService.dailyDatabaseBackupFileSendEmail(file_name, sendEmail, databaseName);
		});
	};
}
