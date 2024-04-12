import axios from "axios";
import { config } from "../config";
import { NOTIFICATION_TEMPLATE } from "../constants";

interface MessagePayload {
	customer_name: string;
	order_number: string;
}

interface MessageComponents {
	type: "HEADER" | "BODY";
	parameters: Array<{
		type: "text";
		text: string;
	}>;
}

export default class WhatsAppAPIService {
	static sendMessage = async (recipient: string, template_name: NOTIFICATION_TEMPLATE, message_data: MessagePayload) => {
		const components: Array<MessageComponents> = [
			{
				type: "BODY",
				parameters: [
					{
						type: "text",
						text: message_data.customer_name,
					},
					{
						type: "text",
						text: message_data.order_number,
					},
				],
			},
		];
		return new WhatsAppAPIService().sendMessage(recipient, template_name, components);
	};

	public sendMessage = async (recipient: string, template_name: NOTIFICATION_TEMPLATE, components: Array<MessageComponents>) => {
		const messageData = this.getTextMessageInput(recipient, template_name, components);
		const config1 = {
			method: "post",
			url: `https://graph.facebook.com/${config.whatsapp.whatsapp_version}/${config.whatsapp.whatsapp_mobile_number_id}/messages`,
			headers: {
				Authorization: `Bearer ${config.whatsapp.whatsapp_token}`,
				"Content-Type": "application/json",
			},
			data: messageData,
		};
		return await axios(config1)
			.then((response) => {
				console.log("Response ===> ", response.data);
			})
			.catch((error) => {
				console.log("Error ===> ", error.response.data);
			});
	};

	public getTextMessageInput = (recipient: string, template_name: NOTIFICATION_TEMPLATE, components: Array<MessageComponents>) => {
		return JSON.stringify({
			messaging_product: "whatsapp",
			to: `91${recipient}`,
			type: "template",
			template: {
				name: template_name,
				language: {
					code: "en",
				},
				components: components,
			},
		});
	};
}
