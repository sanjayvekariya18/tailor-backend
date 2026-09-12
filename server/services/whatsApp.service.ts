import path from "path";
import fs from "fs";
import pino from "pino";
import qrcodeTerminal from "qrcode-terminal";
import QRCode from "qrcode";
import makeWASocket, { DisconnectReason, useMultiFileAuthState, WASocket } from "baileys";
import { Boom } from "@hapi/boom";
import { config, logger } from "../config";
import { NOTIFICATION_TEMPLATE } from "../constants";

interface MessagePayload {
	customer_name: string;
	order_number: string;
}

export type WhatsAppConnectionStatus = "disabled" | "connecting" | "waiting_for_scan" | "connected" | "disconnected";

// Baileys logs very verbosely at "info" — keep it quiet unless something's wrong.
const baileysLogger = pino({ level: "warn" }) as any;

const AUTH_DIR = path.join(__dirname, "../../", config.whatsapp.auth_dir);
const COUNTER_FILE = path.join(AUTH_DIR, "daily-send-count.json");

export default class WhatsAppAPIService {
	private static sock: WASocket | null = null;
	private static connecting: Promise<void> | null = null;

	// Drives the browser-based QR linking page (see whatsAppStatus.controller.ts) so
	// a non-technical user can scan the QR from their own phone's browser instead of
	// needing SSH/terminal access to the server.
	private static status: WhatsAppConnectionStatus = "disconnected";
	private static latestQR: string | null = null;

	// Call once at server startup. Safe to call more than once — subsequent
	// calls are no-ops while a connection already exists or is being made.
	static initialize = async (): Promise<void> => {
		if (!config.whatsapp.enabled) {
			WhatsAppAPIService.status = "disabled";
			logger.warn("WhatsApp (Baileys) is disabled via WHATSAPP_ENABLED=false — notifications will be skipped.");
			return;
		}
		if (WhatsAppAPIService.sock || WhatsAppAPIService.connecting) {
			return WhatsAppAPIService.connecting ?? undefined;
		}
		WhatsAppAPIService.status = "connecting";
		WhatsAppAPIService.connecting = WhatsAppAPIService.connect();
		return WhatsAppAPIService.connecting;
	};

	// Current connection state plus (when waiting to be scanned) the raw QR payload.
	// Used by whatsAppStatus.controller.ts to render the browser-based linking page.
	static getStatus = (): { status: WhatsAppConnectionStatus } => ({ status: WhatsAppAPIService.status });

	static getQrImageDataUrl = async (): Promise<string | null> => {
		if (!WhatsAppAPIService.latestQR) return null;
		try {
			return await QRCode.toDataURL(WhatsAppAPIService.latestQR, { width: 320, margin: 2 });
		} catch (error) {
			logger.warn(`WhatsApp: failed to render QR as an image: ${error}`);
			return null;
		}
	};

	private static connect = async (): Promise<void> => {
		fs.mkdirSync(AUTH_DIR, { recursive: true });
		const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

		const sock = makeWASocket({
			auth: state,
			logger: baileysLogger,
			printQRInTerminal: false,
		});

		sock.ev.on("creds.update", saveCreds);

		sock.ev.on("connection.update", (update) => {
			const { connection, lastDisconnect, qr } = update;

			if (qr) {
				// Scan this with WhatsApp > Linked Devices on the phone that should
				// send these notifications. Only needed once — after that, the saved
				// session in AUTH_DIR keeps you logged in across restarts.
				// Also exposed as an actual QR image at the browser-based linking page
				// (whatsAppStatus.controller.ts) so this doesn't require server access.
				WhatsAppAPIService.latestQR = qr;
				WhatsAppAPIService.status = "waiting_for_scan";
				logger.info("WhatsApp: scan this QR code with the business phone (WhatsApp > Linked Devices > Link a Device):");
				qrcodeTerminal.generate(qr, { small: true });
			}

			if (connection === "open") {
				WhatsAppAPIService.status = "connected";
				WhatsAppAPIService.latestQR = null;
				logger.info("WhatsApp (Baileys) connected.");
			}

			if (connection === "close") {
				WhatsAppAPIService.sock = null;
				WhatsAppAPIService.connecting = null;
				WhatsAppAPIService.latestQR = null;
				const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
				const loggedOut = statusCode === DisconnectReason.loggedOut;
				WhatsAppAPIService.status = loggedOut ? "disconnected" : "connecting";
				logger.warn(`WhatsApp (Baileys) connection closed (loggedOut=${loggedOut}). ${loggedOut ? "" : "Reconnecting..."}`);
				if (loggedOut) {
					logger.error(
						`WhatsApp (Baileys) was logged out — delete "${config.whatsapp.auth_dir}" and restart the server to re-link with a fresh QR code.`
					);
				} else {
					// Network hiccup / restart, not a manual logout — safe to reconnect.
					WhatsAppAPIService.initialize().catch((error) => logger.error(`WhatsApp (Baileys) reconnect failed: ${error}`));
				}
			}
		});

		WhatsAppAPIService.sock = sock;
	};

	// India-only normalization: DB stores 10-digit local mobile numbers.
	// Baileys addresses recipients as a JID, e.g. "919876543210@s.whatsapp.net".
	private static normalizeRecipient = (rawNumber: string): string | null => {
		const digitsOnly = (rawNumber || "").replace(/\D/g, "");
		let withCountryCode: string | null = null;
		if (digitsOnly.length === 10) withCountryCode = `91${digitsOnly}`;
		else if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) withCountryCode = digitsOnly;
		else if (digitsOnly.length === 13 && digitsOnly.startsWith("091")) withCountryCode = `91${digitsOnly.slice(3)}`;
		return withCountryCode ? `${withCountryCode}@s.whatsapp.net` : null;
	};

	// Free-form text, since Baileys doesn't go through Meta's template approval.
	private static messageTextFor = (template_name: NOTIFICATION_TEMPLATE, message_data: MessagePayload): string => {
		switch (template_name) {
			case NOTIFICATION_TEMPLATE.CREATE:
				return `Hi ${message_data.customer_name}, your order #${message_data.order_number} has been received. We'll notify you when it's ready.`;
			case NOTIFICATION_TEMPLATE.COMPLETE:
				return `Hi ${message_data.customer_name}, your order #${message_data.order_number} is ready for pickup!`;
			default:
				return `Hi ${message_data.customer_name}, update on your order #${message_data.order_number}.`;
		}
	};

	// Self-imposed safety cap (default 200/day) so this doesn't look like bulk/spam
	// traffic to WhatsApp. Persisted to disk so it survives server restarts.
	private static canSendMoreToday = (): boolean => {
		const today = new Date().toISOString().slice(0, 10);
		let record = { date: today, count: 0 };
		try {
			if (fs.existsSync(COUNTER_FILE)) {
				const saved = JSON.parse(fs.readFileSync(COUNTER_FILE, "utf-8"));
				if (saved.date === today) record = saved;
			}
		} catch {
			// Corrupt/missing counter file — treat as a fresh day rather than blocking sends.
		}
		if (record.count >= config.whatsapp.daily_limit) {
			logger.warn(`WhatsApp daily limit reached (${config.whatsapp.daily_limit}/day) — skipping further sends until tomorrow.`);
			return false;
		}
		record.count += 1;
		try {
			fs.mkdirSync(AUTH_DIR, { recursive: true });
			fs.writeFileSync(COUNTER_FILE, JSON.stringify(record));
		} catch (error) {
			logger.warn(`WhatsApp: failed to persist daily send counter: ${error}`);
		}
		return true;
	};

	// Fire-and-forget friendly: never throws. Returns true only if the message was handed off to WhatsApp.
	static sendMessage = async (recipient: string, template_name: NOTIFICATION_TEMPLATE, message_data: MessagePayload): Promise<boolean> => {
		if (!config.whatsapp.enabled) {
			logger.warn(`WhatsApp disabled — skipped "${template_name}" to ${recipient}`);
			return false;
		}

		// sock can exist while still linking/reconnecting; Baileys then throws
		// "Cannot read properties of undefined (reading 'id')" on sendMessage.
		if (!WhatsAppAPIService.sock || WhatsAppAPIService.status !== "connected") {
			logger.warn(
				`WhatsApp not ready (status=${WhatsAppAPIService.status}) — skipped "${template_name}" to ${recipient}`
			);
			return false;
		}

		const jid = WhatsAppAPIService.normalizeRecipient(recipient);
		if (!jid) {
			logger.warn(`WhatsApp skipped "${template_name}": "${recipient}" is not a valid 10-digit mobile number`);
			return false;
		}

		if (!WhatsAppAPIService.canSendMoreToday()) {
			return false;
		}

		try {
			await WhatsAppAPIService.sock.sendMessage(jid, { text: WhatsAppAPIService.messageTextFor(template_name, message_data) });
			logger.info(`WhatsApp "${template_name}" sent to ${jid}`);
			return true;
		} catch (error: any) {
			logger.error(`WhatsApp "${template_name}" to ${jid} failed: ${error?.message || error}`);
			return false;
		}
	};
}
