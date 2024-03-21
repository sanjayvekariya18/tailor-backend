import {
	Category,
	Customer,
	CustomerMeasurement,
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

const initSchemaRelationship = () => {
	// category
	Category.hasOne(CustomerMeasurement, { foreignKey: "category_id", sourceKey: "category_id" });
	Category.hasOne(Measurement, { foreignKey: "category_id", sourceKey: "category_id" });
	Category.hasOne(WorkerPrice, { foreignKey: "category_id", sourceKey: "category_id" });
	Category.hasOne(OrderProduct, { foreignKey: "category_id", sourceKey: "category_id" });

	//Customer  Measurement
	CustomerMeasurement.hasOne(Customer, { foreignKey: "customer_id", sourceKey: "customer_id" });
	CustomerMeasurement.hasOne(Category, { foreignKey: "category_id", sourceKey: "category_id" });
	CustomerMeasurement.hasOne(Measurement, { foreignKey: "measurement_id", sourceKey: "measurement_id" });

	// Measurement
	Measurement.hasOne(Category, { foreignKey: "category_id", sourceKey: "category_id" });

	//Order
	Order.hasOne(Customer, { foreignKey: "customer_id", sourceKey: "customer_id" });

	//order images
	OrderImages.hasOne(Order, { foreignKey: "order_id", sourceKey: "order_id" });

	//order Payment
	OrderPayment.hasOne(Order, { foreignKey: "order_id", sourceKey: "order_id" });

	//Purchase Payment
	PurchasePayment.hasOne(Purchase, { foreignKey: "purchase_id", sourceKey: "purchase_id" });

	//Worker
	Worker.hasMany(WorkerPrice, { foreignKey: "worker_id", sourceKey: "worker_id" });
	Worker.hasOne(WorkerPayment, { foreignKey: "worker_id", sourceKey: "worker_id" });
	Worker.hasOne(OrderProduct, { foreignKey: "worker_id", sourceKey: "worker_id" });

	//Worker Price
	WorkerPrice.hasOne(Category, { foreignKey: "category_id", sourceKey: "category_id" });
	WorkerPrice.hasOne(Worker, { foreignKey: "worker_id", sourceKey: "worker_id" });

	//worker payment
	WorkerPayment.hasOne(Worker, { foreignKey: "worker_id", sourceKey: "worker_id" });

	// orderProduct
	OrderProduct.hasOne(Order, { foreignKey: "order_id", sourceKey: "order_id" });
	OrderProduct.hasOne(Category, { foreignKey: "category_id", sourceKey: "category_id" });
	OrderProduct.hasOne(Worker, { foreignKey: "worker_id", sourceKey: "worker_id" });
};

export default initSchemaRelationship;
