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

export enum NOTIFICATION_TEMPLATE {
	CREATE = "create",
	COMPLETE = "complete",
}
