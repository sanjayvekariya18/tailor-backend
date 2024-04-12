import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { OrderProductController, WorkerController } from "../../controller";

const router = Router();
const workerController = new WorkerController();
const orderProductController = new OrderProductController();

router.get("/", requestValidate(workerController.getAll.validation), use(workerController.getAll.controller));
router.get("/assign", requestValidate(workerController.worker_assign_task.validation), use(workerController.worker_assign_task.controller));
router.post("/", requestValidate(workerController.create.validation), use(workerController.create.controller));
router.post("/worker_assign_task", requestValidate(orderProductController.bulkCreate.validation), use(orderProductController.bulkCreate.controller));
router.put("/:worker_id", requestValidate(workerController.edit.validation), use(workerController.edit.controller));
router.delete("/:worker_id", use(workerController.delete.controller));

export default router;
