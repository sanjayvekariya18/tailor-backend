import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { CategoryController } from "../../controller";

const router = Router();
const categoryController = new CategoryController();

router.get("/category_list", use(categoryController.getCategoryList.controller));
export default router;
