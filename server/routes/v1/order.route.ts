import { Router } from "express";
import { OrderController } from "../../controller";
import { use } from "../../errorHandler";
import { requestValidate } from "../../utils/helper";

const router = Router();
const orderController = new OrderController();

router.post("/", requestValidate(orderController.create.validation), use(orderController.create.controller));

export default router;
