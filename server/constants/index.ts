export const NODE_MODE = {
	DEVELOPMENT: "development",
	PRODUCTION: "production",
};

export enum PERMISSIONS {
	ALL = "ALL",
}

export const image = ["image/apng", "image/avif", "image/gif", "image/jpeg", "image/png", "image/svg+xml", "image/webp", "image/heic", "image/bmp"];

export const video = ["video/3gpp", "video/3gpp2", "video/3gp2", "video/mp4", "video/mov", "video/ogg", "video/wmv", "video/qt", "video/avi"];

export enum SORTING {
	DESC = "DESC",
	ASC = "ASC",
}

export enum WORKER_ASSIGN_TASK {
	pending = 0,
	assign = 1,
	complete = 2,
}

export enum BILL_STATUS {
	UNPAID = "unpaid",
	PAID = "paid",
}

// Internal keys picking which free-form WhatsApp message text to send (see
// whatsApp.service.ts's messageTextFor). Since we're sending via Baileys, not
// Meta's Cloud API, these are no longer restricted to pre-approved template names.
export enum NOTIFICATION_TEMPLATE {
	CREATE = "order_created",
	COMPLETE = "order_ready",
	DELIVERED = "order_delivered",
}
