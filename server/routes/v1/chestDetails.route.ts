import { Router } from "express";
import { ChestDetailsController } from "../../controller";
import { use } from "../../errorHandler";

const router = Router();
const chestDetailsController = new ChestDetailsController();

router.get("/", use(chestDetailsController.findAll.controller));

export default router;
