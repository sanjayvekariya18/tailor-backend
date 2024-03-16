import { Router } from "express";
import { requestValidate } from "../../utils/helper";
import { use } from "../../errorHandler";
import { MeasurementController } from "../../controller";

const router = Router();
const measurementController = new MeasurementController();

router.get("/", requestValidate(measurementController.getAll.validation), use(measurementController.getAll.controller));
router.get("/:category_id", use(measurementController.findAll.controller));
router.post("/", requestValidate(measurementController.create.validation), use(measurementController.create.controller));
router.put("/:measurement_id", requestValidate(measurementController.edit.validation), use(measurementController.edit.controller));
router.delete("/:measurement_id", use(measurementController.delete.controller));

export default router;
