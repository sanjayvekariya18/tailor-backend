import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { DeliveryController } from "../../controller";

const router = Router();
const deliveryController = new DeliveryController();

router.get("/:delivery_id", use(deliveryController.findOne.controller));
router.get("/find_completed_order/:order_id", use(deliveryController.findAllCompletedTask.controller));
router.get("/", requestValidate(deliveryController.getAll.validation), use(deliveryController.getAll.controller));
router.post("/", requestValidate(deliveryController.create.validation), use(deliveryController.create.controller));
router.put("/:delivery_id", requestValidate(deliveryController.edit.validation), use(deliveryController.edit.controller));

export default router;
