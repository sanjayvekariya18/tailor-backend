import { Router } from "express";
import { OrderController } from "../../controller";
import { use } from "../../errorHandler";
import { requestValidate } from "../../utils/helper";

const router = Router();
const orderController = new OrderController();

router.post("/", requestValidate(orderController.create.validation), use(orderController.create.controller));
router.put("/:order_id", requestValidate(orderController.edit.validation), use(orderController.edit.controller));
router.put("/:order_id/payment", use(orderController.payment.controller));

export default router;
