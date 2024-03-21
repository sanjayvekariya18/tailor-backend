import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { CategoryController, WorkerController } from "../../controller";

const router = Router();
const categoryController = new CategoryController();
const workerController = new WorkerController();

router.get("/category_list", use(categoryController.getCategoryList.controller));
router.get("/worker_list", use(workerController.getWorkerList.controller));
export default router;
