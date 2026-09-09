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
import PurchaseRoute from "./purchase.route";
import PurchasePaymentRoute from "./purchasePayment.route";
import DeliveryRoute from "./delivery.route";
import dashboardRoute from "./dashboard.route";
import whatsappRoute from "./whatsapp.route";
import { TokenVerifyMiddleware } from "../../middlewares";
import { UserController, WhatsAppStatusController } from "../../controller";

const router = Router();
const authorizationController = new AuthorizationController();
const userController = new UserController();
const whatsAppStatusController = new WhatsAppStatusController();

router.post("/login", requestValidate(authorizationController.login.validation), use(authorizationController.login.controller));
// Deliberately NOT behind TokenVerifyMiddleware: this is a plain link (with its own
// ?token= secret, see WHATSAPP_QR_ACCESS_TOKEN) meant to be opened directly in a
// browser by a shop user with no app login, to scan the WhatsApp linking QR code.
router.get("/whatsapp-status", use(whatsAppStatusController.view.controller));
router.put("/:user_id", TokenVerifyMiddleware, requestValidate(userController.edit.validation), use(userController.edit.controller));
router.get("/user", TokenVerifyMiddleware, use(userController.getAll.controller));
router.use("/category", TokenVerifyMiddleware, categoryRoute);
router.use("/measurement", TokenVerifyMiddleware, measurementRoute);
router.use("/worker", TokenVerifyMiddleware, workerRoute);
router.use("/chest_details", TokenVerifyMiddleware, chestDetailsRoute);
router.use("/worker_payment", TokenVerifyMiddleware, workerPaymentRoute);
router.use("/customer", TokenVerifyMiddleware, CustomerRoute);
router.use("/order", TokenVerifyMiddleware, OrderRoute);
router.use("/list", TokenVerifyMiddleware, ListRoute);
router.use("/order_product", TokenVerifyMiddleware, OrderProductRoute);
router.use("/purchase", TokenVerifyMiddleware, PurchaseRoute);
router.use("/purchase_payment", TokenVerifyMiddleware, PurchasePaymentRoute);
router.use("/delivery", TokenVerifyMiddleware, DeliveryRoute);
router.use("/dashboard", TokenVerifyMiddleware, dashboardRoute);
router.use("/whatsapp", TokenVerifyMiddleware, whatsappRoute);

export default router;
