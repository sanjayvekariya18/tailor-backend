import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { WorkerController } from "../../controller";

const router = Router();
const workerController = new WorkerController();

router.get("/", requestValidate(workerController.getAll.validation), use(workerController.getAll.controller));
router.post("/", requestValidate(workerController.create.validation), use(workerController.create.controller));
router.put("/:worker_id", requestValidate(workerController.edit.validation), use(workerController.edit.controller));
router.delete("/:worker_id", use(workerController.delete.controller));

export default router;
