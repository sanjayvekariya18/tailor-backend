import { Request, NextFunction, Response } from "express";
import { TokenExpiredUserHandler, UnauthorizedUserHandler } from "../errorHandler";
import moment from "moment";
import { isEmpty, _json } from "../utils/helper";
import { LoggedInUserTokenPayload } from "../services/authorization.service";
import { TokenService, AuthorizationService } from "../services";

const tokenService = new TokenService();
const authorizationService = new AuthorizationService();

const TokenVerifyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	if (req.url == "/login") {
		return next();
	}
	let authorization = req.header("Authorization");
	if (authorization) {
		authorization = authorization.replace("Bearer ", "");
		if (authorization && authorization != "null" && authorization != null) {
			return tokenService
				.decode(authorization)
				.then(async (payload: LoggedInUserTokenPayload) => {
					if (payload?.user?.id) {
						const isExpire = !(payload.expires >= moment().unix());
						if (isExpire) {
							return next(new TokenExpiredUserHandler());
						}
						const _user = await authorizationService.findUserById(payload.user.id);
						if (isEmpty(_user)) {
							return next(new UnauthorizedUserHandler());
						}
						if (_user) {
							req.authUser = {
								id: _user.login_id,
								userName: _user.user_name,
							};
						}

						if (Array.isArray(req.body)) {
							req.body = req.body.map((data) => {
								return {
									...data,
									loggedInUserId: payload.user.id,
								};
							});
						} else {
							req.body["loggedInUserId"] = payload.user.id;
						}
						return next();
					} else {
						return next(new UnauthorizedUserHandler("Invalid Token"));
					}
				})
				.catch((err) => next(err));
		} else {
			return next(new UnauthorizedUserHandler());
		}
	} else {
		return next(new UnauthorizedUserHandler());
	}
};
export default TokenVerifyMiddleware;
