import { Twilio } from "twilio";
import { config } from "../config";
import { NOTIFICATION_TEMPLATE } from "../constants";

interface MessagePayload {
	customer_name: string;
	order_number: string;
}

export default class TwilioMessageService {
	private static accountSid = config.twilio.account_sid;
	private static authToken = config.twilio.auth_token;

	static sendMessage = async (recipient: string, template_name: NOTIFICATION_TEMPLATE, message_data: MessagePayload) => {
		const contentSid = template_name == NOTIFICATION_TEMPLATE.CREATE ? "create" : "complete";
		const client = new Twilio(this.accountSid, this.authToken);
		await client.messages
			.create({
				contentSid,
				contentVariables: JSON.stringify({
					1: message_data.customer_name,
					2: message_data.order_number,
				}),
				from: "whatsapp:" + config.twilio.from,
				to: "whatsapp:" + recipient,
			})
			.then((message) => {
				console.log(message.body);
			});
	};
}
