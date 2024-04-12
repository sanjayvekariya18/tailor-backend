import { logger } from "../config";
import {
	Category,
	ChestDetails,
	Customer,
	CustomerMeasurement,
	Delivery,
	DeliveryDetails,
	Login,
	Measurement,
	Order,
	OrderImages,
	OrderPayment,
	OrderProduct,
	Purchase,
	PurchasePayment,
	Worker,
	WorkerPayment,
	WorkerPrice,
} from "../models";

const createTables = async () => {
	const successFullTable: Array<string> = [];
	const errorTable: Array<string> = [];

	await Customer.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Customer Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Customer Table Error : ${error}`);
		});

	await Login.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Login Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Login Table Error : ${error}`);
		});

	await Category.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Category Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Category Table Error : ${error}`);
		});

	await ChestDetails.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`ChestDetails Table Created`);
		})
		.catch((error) => {
			errorTable.push(`ChestDetails Table Error : ${error}`);
		});

	await Measurement.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Measurement Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Measurement Table Error : ${error}`);
		});

	await Order.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Order Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Order Table Error : ${error}`);
		});

	await Worker.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Worker Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Worker Table Error : ${error}`);
		});

	await OrderProduct.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`OrderProduct Table Created`);
		})
		.catch((error) => {
			errorTable.push(`OrderProduct Table Error : ${error}`);
		});

	await OrderImages.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`OrderImages Table Created`);
		})
		.catch((error) => {
			errorTable.push(`OrderImages Table Error : ${error}`);
		});
	await CustomerMeasurement.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`CustomerMeasurement Table Created`);
		})
		.catch((error) => {
			errorTable.push(`CustomerMeasurement Table Error : ${error}`);
		});

	await OrderPayment.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`OrderPayment Table Created`);
		})
		.catch((error) => {
			errorTable.push(`OrderPayment Table Error : ${error}`);
		});

	await Purchase.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Purchase Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Purchase Table Error : ${error}`);
		});

	await PurchasePayment.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`PurchasePayment Table Created`);
		})
		.catch((error) => {
			errorTable.push(`PurchasePayment Table Error : ${error}`);
		});

	await WorkerPayment.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`WorkerPayment Table Created`);
		})
		.catch((error) => {
			errorTable.push(`WorkerPayment Table Error : ${error}`);
		});

	await WorkerPrice.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`WorkerPrice Table Created`);
		})
		.catch((error) => {
			errorTable.push(`WorkerPrice Table Error : ${error}`);
		});

	await Delivery.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Delivery Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Delivery Table Error : ${error}`);
		});

	await DeliveryDetails.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`DeliveryDetails Table Created`);
		})
		.catch((error) => {
			errorTable.push(`DeliveryDetails Table Error : ${error}`);
		});

	const totalTable = successFullTable.length + errorTable.length;

	logger.info(`Total Tables In ParthTailor Database : ${totalTable}`);
	if (successFullTable.length > 0) {
		logger.info(`Tables Created In ParthTailor Database`);
		successFullTable.forEach((message: string, index: number) => {
			logger.warn(`${index + 1}/${totalTable} - ${message}`);
		});
	}
	if (errorTable.length > 0) {
		logger.error(`Tables Failed In ParthTailor Database`);
		errorTable.forEach((message) => {
			logger.error(message);
		});
	}
};

export default createTables;
