import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { PurchasePaymentController } from "../../controller";

const router = Router();
const purchasePaymentController = new PurchasePaymentController();

router.post("/", requestValidate(purchasePaymentController.create.validation), use(purchasePaymentController.create.controller));
router.put("/:purchase_payment_id", requestValidate(purchasePaymentController.edit.validation), use(purchasePaymentController.edit.controller));
router.delete("/:purchase_payment_id", use(purchasePaymentController.delete.controller));

export default router;
