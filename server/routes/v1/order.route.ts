import { Router } from "express";
import { OrderController } from "../../controller";
import { use } from "../../errorHandler";
import { requestValidate } from "../../utils/helper";

const router = Router();
const orderController = new OrderController();

router.get("/", requestValidate(orderController.getAll.validation), use(orderController.getAll.controller));
router.get(
	"/delivery_order_reminder",
	requestValidate(orderController.deliveryOrderRemain.validation),
	use(orderController.deliveryOrderRemain.controller)
);
router.post("/", requestValidate(orderController.create.validation), use(orderController.create.controller));
router.put("/:order_id", requestValidate(orderController.edit.validation), use(orderController.edit.controller));
router.put("/:order_id/payment", use(orderController.payment.controller));
router.delete("/:order_id", use(orderController.delete.controller));

export default router;
