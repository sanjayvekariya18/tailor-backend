import { Request, Response } from "express";
import { config } from "../config";
import { WhatsAppAPIService } from "../services";

// Serves a small standalone HTML page (not part of the React admin app) that lets
// a non-technical user link the business WhatsApp number by scanning a QR code from
// their own phone's browser — no SSH/server/terminal access required. Protected by a
// shared-secret query token (WHATSAPP_QR_ACCESS_TOKEN) instead of the normal app
// login, since this is meant to be opened as a plain link, not through the app UI.
export default class WhatsAppStatusController {
	private statusLabel: Record<string, string> = {
		disabled: "WhatsApp notifications are turned off on the server (WHATSAPP_ENABLED=false).",
		connecting: "Connecting to WhatsApp… refresh in a few seconds if no QR code appears.",
		waiting_for_scan: "Open WhatsApp on the phone you want to send notifications from, go to Settings > Linked Devices > Link a Device, and scan this code.",
		connected: "Connected. WhatsApp order notifications are active.",
		disconnected: "Disconnected. Ask your developer to restart the server to get a fresh QR code.",
	};

	private renderPage = (bodyHtml: string, autoRefresh: boolean): string => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>WhatsApp Setup</title>
${autoRefresh ? '<meta http-equiv="refresh" content="5">' : ""}
<style>
	body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 48px 20px; background: #f7f7f8; color: #1a1a1a; }
	h1 { font-size: 20px; margin: 0 0 12px; }
	p { color: #555; margin: 0 auto 28px; max-width: 380px; line-height: 1.5; }
	img { border: 1px solid #ddd; border-radius: 12px; padding: 16px; background: white; }
	.checkmark { font-size: 56px; color: #1a7f37; }
</style>
</head>
<body>
	<h1>WhatsApp Notification Setup</h1>
	${bodyHtml}
</body>
</html>`;

	// Authenticated JSON endpoint (behind the app's normal login, unlike `view` below)
	// for the admin UI itself to poll and show a Connected/Not Connected badge in the
	// header. Plain navigation (a link/button opening a new tab) can't carry the app's
	// Authorization header, which is why the actual QR-scanning page below uses its
	// own separate ?token= secret instead of this same auth.
	public status = {
		controller: async (req: Request, res: Response): Promise<void> => {
			const { status } = WhatsAppAPIService.getStatus();
			// qrPageToken is only the shared secret that unlocks the standalone linking
			// page below -- not the WhatsApp QR image itself, which that page fetches
			// live. null here just means the admin hasn't set WHATSAPP_QR_ACCESS_TOKEN,
			// so the "Connect WhatsApp" button has nothing to link to yet.
			const qrPageToken = config.whatsapp.qr_access_token || null;
			return res.api.create({ status, qrPageToken });
		},
	};

	public view = {
		controller: async (req: Request, res: Response): Promise<void> => {
			res.set("Cache-Control", "no-store");

			const expectedToken = config.whatsapp.qr_access_token;
			if (!expectedToken) {
				res.status(404).send(this.renderPage("<p>This page is not enabled.</p>", false));
				return;
			}

			const providedToken = typeof req.query.token === "string" ? req.query.token : "";
			if (providedToken !== expectedToken) {
				res.status(403).send(this.renderPage("<p>Not authorized. Check the link you were given.</p>", false));
				return;
			}

			const { status } = WhatsAppAPIService.getStatus();
			const message = this.statusLabel[status] || status;

			let body = `<p>${message}</p>`;
			if (status === "waiting_for_scan") {
				const qrDataUrl = await WhatsAppAPIService.getQrImageDataUrl();
				body += qrDataUrl ? `<img src="${qrDataUrl}" alt="WhatsApp QR code" width="320" height="320" />` : "<p>Generating QR code…</p>";
			} else if (status === "connected") {
				body += `<div class="checkmark">&#10003;</div>`;
			}

			res.set("Content-Type", "text/html").status(200).send(this.renderPage(body, status !== "connected"));
		},
	};
}
