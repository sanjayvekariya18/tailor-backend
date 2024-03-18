import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { OrderProductController } from "../../controller";

const router = Router();
const orderProductController = new OrderProductController();

router.get("/", requestValidate(orderProductController.getAll.validation), use(orderProductController.getAll.controller));
router.post("/", requestValidate(orderProductController.create.validation), use(orderProductController.create.controller));
router.put("/:order_product_id", use(orderProductController.changeStatus.controller));

export default router;
