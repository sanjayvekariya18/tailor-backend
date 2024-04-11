import { NextFunction, Request, Response } from "express";
import { fileType, isEmpty, removeFile, saveFile } from "../utils/helper";
import { UserService } from "../services";
import { LoginValidation } from "../validations";
import { EditUserDTO, LoginDTO } from "../dto";
import { Op } from "sequelize";
import { image } from "../constants";

export default class UserController {
	private userService = new UserService();
	private loginValidation = new LoginValidation();

	public getAll = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.userService.getAll();
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.loginValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const reqUserData = new LoginDTO(req.body);
			const checkUserData = await this.userService.findOne({ mobile_no: reqUserData.mobile_no });
			if (!isEmpty(checkUserData)) {
				return res.api.badResponse({ message: "User already exit" });
			}
			const data = await this.userService.create(reqUserData);
			return res.api.create(data);
		},
	};

	public edit = {
		validation: this.loginValidation.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const userId: string = req.params["user_id"] as string;
			const reqUserData = new EditUserDTO(req.body);
			const checkUserData = await this.userService.findOne({ login_id: userId });
			if (checkUserData == null) {
				return res.api.badResponse({ message: "User Data Not Found" });
			}

			if (reqUserData.mobile_no !== undefined) {
				const CheckCustomerData = await this.userService.findOne({
					mobile_no: reqUserData.mobile_no,
					login_id: { [Op.not]: userId },
				});
				if (!isEmpty(CheckCustomerData)) {
					return res.api.badResponse({ message: "Customer Already Exit" });
				}
			}

			const file: any = req.files;
			if (file) {
				if (file.logo) {
					let fileValidation = fileType(file.logo, image);
					if (fileValidation === false) {
						return res.api.validationErrors({
							message: ["Invalid profile file"],
						});
					}
					// Remove old image
					await removeFile(checkUserData?.logo);
					// Upload new image
					let file_path: any = await saveFile(file.logo, "logo");
					reqUserData.logo = file_path.upload_path;
				}
			}

			const data = await this.userService.edit(userId, reqUserData);
			return res.api.create(data);
		},
	};
}
