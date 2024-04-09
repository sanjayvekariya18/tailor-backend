import { sequelizeConnection } from "../config/database";
import { NOTIFICATION_TEMPLATE } from "../constants";

export interface MessageComponents {
	type: "HEADER" | "BODY";
	parameters: Array<{
		type: "text";
		text: string;
	}>;
}

export default class NotificationService {
	private static Sequelize = sequelizeConnection.Sequelize;

	// static job_create = async (order_number: string, transaction?: Transaction) => {
	// 	const template = NOTIFICATION_TEMPLATE.CREATE;
	// 	const job_work_data = await this.getJobWorkData(order_number, undefined, transaction);
	// 	let messageStr = await this.getTemplateContent(template);
	// 	if (send_message && job_work_data && job_work_data != null && messageStr) {
	// 		const productListStr = await this.getProductString(job_work_data.id, transaction);

	// 		const components: Array<MessageComponents> = [
	// 			{
	// 				type: "HEADER",
	// 				parameters: [
	// 					{
	// 						type: "text",
	// 						text: order_number,
	// 					},
	// 				],
	// 			},
	// 			{
	// 				type: "BODY",
	// 				parameters: [
	// 					{
	// 						type: "text",
	// 						text: job_work_data.collected_from_name,
	// 					},
	// 					{
	// 						type: "text",
	// 						text: job_work_data.collected_from_number,
	// 					},
	// 					{
	// 						type: "text",
	// 						text: moment(job_work_data.received_date).format("DD-MM-YYYY"),
	// 					},
	// 					{
	// 						type: "text",
	// 						text: productListStr,
	// 					},
	// 				],
	// 			},
	// 		];

	// 		messageStr = messageStr.replace("{{job_number}}", order_number);
	// 		messageStr = messageStr.replace("{{collected_from}}", job_work_data.collected_from_name);
	// 		messageStr = messageStr.replace("{{collected_from_mobile}}", job_work_data.collected_from_number);
	// 		messageStr = messageStr.replace("{{received_date}}", moment(job_work_data.received_date).format("DD-MM-YYYY"));
	// 		messageStr = messageStr.replace("{{product_name_quantity_list}}", productListStr);

	// 		await this.sendMessage(job_work_data.client_id, template, components);
	// 		return messageStr;
	// 	}
	// 	return;
	// };
}
