import { QueryTypes } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { WORKER_ASSIGN_TASK } from "../constants";
import { Category, Customer, Order, OrderProduct, Worker } from "../models";
import { PaginationData } from "../dto";

export default class DashboardService {
	private Sequelize = sequelizeConnection.Sequelize;

	public get_counts = async () => {
		const order_count = await Order.count();
		const pending_order: Array<{ pending_count: number }> = await sequelizeConnection.query(
			`select 
            COUNT(*) as pending_count
            from \`orders\` o 
            where 
            o.order_id in (select op.order_id  from order_product op where op.status = '${WORKER_ASSIGN_TASK.pending}')
            `,
			{ type: QueryTypes.SELECT }
		);
		const completed_order: Array<{ complete_count: number }> = await sequelizeConnection.query(
			`select 
            COUNT(*) as complete_count
            from \`orders\` o 
            where 
            o.order_id in (select op.order_id  from order_product op where op.status = '${WORKER_ASSIGN_TASK.complete}')
            `,
			{ type: QueryTypes.SELECT }
		);
		const customer_count = await Customer.count();
		const worker_count = await Worker.count();

		return {
			order_count,
			pending_order: pending_order.length > 0 ? pending_order[0].pending_count : 0,
			completed_order: completed_order.length > 0 ? completed_order[0].complete_count : 0,
			customer_count,
			worker_count,
		};
	};

	public get_pending_orders = async (pagination_data: PaginationData) => {
		return await OrderProduct.findAndCountAll({
			where: {
				status: WORKER_ASSIGN_TASK.pending,
			},
			include: [
				{ model: Order, attributes: [], include: [{ model: Customer, attributes: ["customer_id", "customer_name", "customer_mobile"] }] },
				{ model: Category, attributes: [] },
			],
			attributes: [
				"order_product_id",
				"order_id",
				"category_id",
				[this.Sequelize.col("Category.category_name"), "category_name"],
				[this.Sequelize.col("Order.order_date"), "order_date"],
				[this.Sequelize.col("Order.customer_id"), "customer_id"],
				[this.Sequelize.col("Order.Customer.customer_name"), "customer_name"],
				[this.Sequelize.col("Order.Customer.customer_mobile"), "customer_mobile"],
				"worker_id",
				"parent",
				"qty",
				"status",
				"price",
				"work_price",
				"work_total",
				"assign_date",
			],
			order: [["customer_name", "ASC"]],
			offset: pagination_data.rowsPerPage * pagination_data.page,
			limit: pagination_data.rowsPerPage,
			raw: true,
		});
	};

	public get_pending_delivery_orders = async (pagination_data: PaginationData) => {
		const offset = pagination_data.rowsPerPage * pagination_data.page;
		const limit = pagination_data.rowsPerPage;

		let query = `select
                op.order_id,
                c.customer_name ,
                c.customer_mobile ,
                op.category_id,
                c2.category_name ,
                sum(op.qty) as total_qty,
                sum(op.price) as total_price,
                coalesce(sum(dd.qty), 0) as total_delivered,
                sum(op.qty) - coalesce(sum(dd.qty), 0) as pending_delivery
            from
                order_product op
            left join \`orders\` o on
                o.order_id = op.order_id
            left join customer c on
                c.customer_id = o.customer_id
            left join category c2 on
                c2.category_id = op.category_id
            left join delivery d on
                d.order_id = op.order_id
            left join delivery_details dd on
                dd.delivery_id = d.delivery_id
                and dd.category_id = op.category_id
            where
                op.status = 'complete'
            group by 
                op.order_id,
                c.customer_name ,
                c.customer_mobile ,
                op.category_id,
                c2.category_name
            having pending_delivery > 0
            `;

		const count = await sequelizeConnection.query(query, { type: QueryTypes.SELECT });
		query += ` LIMIT ${offset}, ${limit};`;
		const rows = await sequelizeConnection.query(query, { type: QueryTypes.SELECT });

		return {
			count: count.length,
			rows,
		};
	};

	public get_category_wise_pending = async () => {
		return await sequelizeConnection.query(
			`
        select
            c.category_id,
            c.category_name,
            c.category_type,
            c.category_image,
            c.is_active,
            count(op.order_product_id) as pending_count
        from
            category c
        left join order_product op on op.category_id = c.category_id 
        where op.status = 'pending'
        group by
            c.category_id,
            c.category_name,
            c.category_type,
            c.category_image,
            c.is_active
        `,
			{ type: QueryTypes.SELECT }
		);
	};
}
