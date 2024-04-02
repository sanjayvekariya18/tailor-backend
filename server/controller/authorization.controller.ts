import { NextFunction, Request, Response } from "express";
import { TokenService, UserService } from "../services";
import { NewAccessToken } from "../services/token.service";
import { UnauthorizedUserHandler } from "../errorHandler";

export default class AuthorizationController {
	private userServices = new UserService();
	private tokenServices = new TokenService();

	public login = {
		validation: {
			user_name: "required|string",
			password: "required|string",
		},
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			await this.userServices
				.findOne({ user_name: req.body.user_name })
				.then(async (userData) => {
					if (userData && userData != null) {
						if (req.body.password == userData.password) {
							const tokenPayload = {
								id: userData.login_id,
								userName: userData.user_name,
							};
							await this.tokenServices
								.generateUserAccessToken(tokenPayload)
								.then(async (tokenInfo: NewAccessToken) => {
									return res.api.create({
										token: tokenInfo.token,
										user: tokenPayload,
									});
								})
								.catch((error) => {
									throw error;
								});
						} else {
							throw new UnauthorizedUserHandler("Invalid credential");
						}
					} else {
						throw new UnauthorizedUserHandler("Invalid credential");
					}
				})
				.catch((error) => {
					throw error;
				});
		},
	};
}
