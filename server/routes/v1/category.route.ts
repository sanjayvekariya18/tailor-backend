import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { CategoryController } from "../../controller";

const router = Router();
const categoryController = new CategoryController();

router.get("/", requestValidate(categoryController.getAll.validation), use(categoryController.getAll.controller));
router.post("/", requestValidate(categoryController.create.validation), use(categoryController.create.controller));
router.put("/:category_id", requestValidate(categoryController.edit.validation), use(categoryController.edit.controller));
router.delete("/:category_id", use(categoryController.delete.controller));

export default router;
