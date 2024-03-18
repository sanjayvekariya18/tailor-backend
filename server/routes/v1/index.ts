import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import AuthorizationController from "../../controller/authorization.controller";
import { use } from "../../errorHandler";
import categoryRoute from "./category.route";
import measurementRoute from "./measurement.route";
import workerRoute from "./worker.route";
import chestDetailsRoute from "./chestDetails.route";
import workerPaymentRoute from "./workerPayment.route";
import CustomerRoute from "./customer.route";
import OrderRoute from "./order.route";
import ListRoute from "./list.route";
import OrderProductRoute from "./orderProduct.route";
import { TokenVerifyMiddleware } from "../../middlewares";

const router = Router();
const authorizationController = new AuthorizationController();

router.post("/login", requestValidate(authorizationController.login.validation), use(authorizationController.login.controller));
router.use("/category", TokenVerifyMiddleware, categoryRoute);
router.use("/measurement", TokenVerifyMiddleware, measurementRoute);
router.use("/worker", TokenVerifyMiddleware, workerRoute);
router.use("/chest_details", TokenVerifyMiddleware, chestDetailsRoute);
router.use("/worker_payment", TokenVerifyMiddleware, workerPaymentRoute);
router.use("/customer", TokenVerifyMiddleware, CustomerRoute);
router.use("/order", TokenVerifyMiddleware, OrderRoute);
router.use("/list", TokenVerifyMiddleware, ListRoute);
router.use("/order_product", TokenVerifyMiddleware, OrderProductRoute);

export default router;
