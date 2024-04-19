import { Router } from "express";
import { DashboardController } from "../../controller";
import { use } from "../../errorHandler";

const router = Router();
const deliveryController = new DashboardController();

router.get("/get_counts", use(deliveryController.get_counts.controller));
router.get("/get_pending_orders", use(deliveryController.get_pending_orders.controller));
router.get("/get_pending_delivery_orders", use(deliveryController.get_pending_delivery_orders.controller));

export default router;
