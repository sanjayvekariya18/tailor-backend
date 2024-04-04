import { Router } from "express";
import { use } from "../../errorHandler";
import { CategoryController, CustomerController, WorkerController } from "../../controller";

const router = Router();
const categoryController = new CategoryController();
const workerController = new WorkerController();
const customerController = new CustomerController();

router.get("/category_list", use(categoryController.getCategoryList.controller));
router.get("/order_category_list", use(categoryController.getCategory_list.controller));
router.get("/worker_list", use(workerController.getWorkerList.controller));
router.get("/customer_list", use(customerController.getCustomerList.controller));
export default router;
