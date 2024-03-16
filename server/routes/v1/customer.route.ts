import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { CustomerController } from "../../controller";

const router = Router();
const customerController = new CustomerController();

router.get("/", requestValidate(customerController.getAll.validation), use(customerController.getAll.controller));
router.post("/", requestValidate(customerController.create.validation), use(customerController.create.controller));
router.put("/:customer_id", requestValidate(customerController.edit.validation), use(customerController.edit.controller));

export default router;
