import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { OrderProductController } from "../../controller";

const router = Router();
const orderProductController = new OrderProductController();

router.get("/", requestValidate(orderProductController.getAll.validation), use(orderProductController.getAll.controller));
router.get(
	"/worker_assign_task",
	requestValidate(orderProductController.getWorkerAssignTask.validation),
	use(orderProductController.getWorkerAssignTask.controller)
);
router.get("/pending_order", use(orderProductController.getPendingOrder.controller));
router.get("/pending_completed_order", use(orderProductController.getPending_completed_order.controller));
router.post("/", requestValidate(orderProductController.create.validation), use(orderProductController.create.controller));
router.put("/:order_product_id", use(orderProductController.changeStatus.controller));

export default router;
