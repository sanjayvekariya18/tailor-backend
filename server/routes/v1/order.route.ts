import { Router } from "express";
import { OrderController } from "../../controller";
import { use } from "../../errorHandler";
import { requestValidate } from "../../utils/helper";

const router = Router();
const orderController = new OrderController();

router.get("/", requestValidate(orderController.getAll.validation), use(orderController.getAll.controller));
router.get("/customer_measurement/:order_id", use(orderController.getCustomerMeasurement.controller));
router.get("/bill", requestValidate(orderController.getCustomerBill.validation), use(orderController.getCustomerBill.controller));
router.get(
	"/get_measurement",
	requestValidate(orderController.findOneCustomerMeasurement.validation),
	use(orderController.findOneCustomerMeasurement.controller)
);
router.get(
	"/delivery_order_reminder",
	requestValidate(orderController.deliveryOrderRemain.validation),
	use(orderController.deliveryOrderRemain.controller)
);
router.get(
	"/customer_payment_data",
	requestValidate(orderController.getCustomerPaymentData.validation),
	use(orderController.getCustomerPaymentData.controller)
);
router.get("/income", requestValidate(orderController.getCustomerPaymentData.validation), use(orderController.income.controller));
router.get("/:id", use(orderController.getOrderDetails.controller));
router.post("/", requestValidate(orderController.create.validation), use(orderController.create.controller));
router.put("/:order_id", requestValidate(orderController.edit.validation), use(orderController.edit.controller));
router.put("/:order_id/payment", use(orderController.payment.controller));
router.delete("/:order_id", use(orderController.delete.controller));

export default router;
