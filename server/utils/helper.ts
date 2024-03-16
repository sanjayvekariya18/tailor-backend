import { isArray } from "lodash";
import { UploadedFile } from "express-fileupload";
import config from "../config/config";
import moment from "moment";
import fs from "fs";
import Validator from "validatorjs";
import { FormErrorsHandler } from "../errorHandler";
import { NextFunction, Response, Request } from "express";
import logger from "../config/logger";

export const isEmpty = (value: any) => {
	if (value == null || value == "null") {
		return true;
	}
	if (typeof value == "object") {
		return Object.keys(value).length == 0;
	}
	return (isArray(value) && value.length == 0) || value == undefined || value == "undefined" || value == null || value == "";
};

export const checkPath = (args: any[], str: String) => {
	return args.find((value) => {
		return value == str;
	})
		? true
		: false;
};

export const getFileName = (args: any[]) => {
	return args
		.filter((value, i) => i != 0 && i != 1)
		.find((value) => {
			return value.includes(".ts");
		});
};

export const generateToken = () => {
	let rand = function () {
		return Math.random().toString(36).substr(2);
	};
	return rand() + rand();
};

export const inArray = (value: any, arr: any[]) => {
	return arr.filter((val: any, i: number) => val == value).length != 0;
};

export const fileType = (files: UploadedFile, arr: any[]) => {
	const array_of_allowed_file_types = arr;
	return array_of_allowed_file_types.includes(files.mimetype);
};

export const saveFile = (files: UploadedFile, uploadPath = "") => {
	let fileUploadPath = config.file_path + "/images/" + uploadPath;
	let fileName = moment().unix() + Math.floor(1000 + Math.random() * 9000) + "." + files.name.split(".").pop();
	return new Promise(async (resolve, reject) => {
		fileUploadPath = fileUploadPath + "/" + fileName;
		files.mv(fileUploadPath, async (err: Error) => {
			if (err) {
				reject(err);
			} else {
				resolve({
					upload_path: "/images/" + uploadPath + "/" + fileName,
					file_name: fileName,
				});
			}
		});
	});
};

export const removeFile = (filePath: string) => {
	return new Promise((resolve, reject) => {
		try {
			filePath = config.file_path + filePath;

			fs.unlinkSync(filePath);
			resolve(true);
		} catch (error) {
			resolve(true);
		}
	});
};

export const getFilePath = (filePath: string) => {
	return config.backend_url + filePath;
};

export const getImagePath = (filePath: string) => {
	return rtrim(config.backend_url, "/") + filePath;
};

export function requestValidate(validationRulesAndMessages: any) {
	validationRulesAndMessages = {
		rules: {
			...validationRulesAndMessages,
		},
	};
	return function (req: Request, res: Response, next: NextFunction) {
		let input: any = {
			...req.body,
			...req.query,
		};
		let validation = new Validator(
			input,
			validationRulesAndMessages.rules,
			validationRulesAndMessages.messages != undefined ? validationRulesAndMessages.messages : {}
		);
		if (validation.fails()) {
			return next(new FormErrorsHandler(validation.errors.errors));
		}
		next();
	};
}

export function uuidv4() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export async function _json(data: any) {
	return await new Promise(async (resolve, reject) => {
		try {
			let dataS: any = await data;
			if (isEmpty(dataS)) {
				resolve([]);
			} else {
				resolve(JSON.parse(JSON.stringify(dataS)));
			}
		} catch (error) {
			reject(error);
		}
	});
}

export async function convertToArray(data: any) {
	let array: any = [];
	if (!isArray(data)) {
		array.push(data);
	} else {
		array = data;
	}
	return array;
}

export function rtrim(str: string, wrd: string) {
	return str.trim().endsWith(wrd) ? str.slice(0, -1) : str;
}

export function _bool(val: any) {
	return !isEmpty(val) && (val == true || val == "true") ? true : false;
}

export async function prettyPrint(obj: any) {
	return JSON.stringify(obj, null, 2);
}

export async function logInfo(payload: { data: any; type: string }) {
	let fileName = moment().format("YYYY_MM_DD") + ".log";
	let dir: string = "./logs";
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	let filePath = dir + "/" + fileName;
	let logInfo: any = `${payload.type}\n`;
	logInfo += await prettyPrint(payload.data);
	logInfo += `\n\n`;

	return await fs.appendFile(filePath, logInfo, (err) => {
		if (err instanceof Error) {
			logger.error(err);
		}
	});
}
