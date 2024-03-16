import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { WorkerPaymentController } from "../../controller";

const router = Router();
const workerPaymentController = new WorkerPaymentController();

router.get("/", requestValidate(workerPaymentController.getAll.validation), use(workerPaymentController.getAll.controller));
router.post("/", requestValidate(workerPaymentController.create.validation), use(workerPaymentController.create.controller));
router.put("/:worker_payment_id", requestValidate(workerPaymentController.edit.validation), use(workerPaymentController.edit.controller));

export default router;
