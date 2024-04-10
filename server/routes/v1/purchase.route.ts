import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { PurchaseController } from "../../controller";

const router = Router();
const purchaseController = new PurchaseController();

router.get("/", requestValidate(purchaseController.getAll.validation), use(purchaseController.getAll.controller));
router.post("/", requestValidate(purchaseController.create.validation), use(purchaseController.create.controller));
router.put("/:purchase_id", requestValidate(purchaseController.edit.validation), use(purchaseController.edit.controller));

export default router;
