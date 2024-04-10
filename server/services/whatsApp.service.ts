import axios from "axios";
import { config } from "../config";
import { MessageComponents } from "./notification.service";
import { NOTIFICATION_TEMPLATE } from "../constants";

export default class WhatsAppAPIService {
	static sendMessage = async (recipient: string, template_name: NOTIFICATION_TEMPLATE, components: Array<MessageComponents>) => {
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
		return await axios(config1);
	};

	public getTextMessageInput = (recipient: string, template_name: NOTIFICATION_TEMPLATE, components: Array<MessageComponents>) => {
		return JSON.stringify({
			messaging_product: "whatsapp",
			to: recipient,
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
