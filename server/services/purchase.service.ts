import { Op } from "sequelize";
import { EditPurchaseDTO, SearchPurchaseDTO, createPurchaseDTO } from "../dto";
import { Purchase } from "../models";

export default class PurchaseService {
	public getAll = async (searchParams: SearchPurchaseDTO) => {
		return await Purchase.findAndCountAll({
			where: {
				...(searchParams.start_date &&
					searchParams.end_date && {
						purchase_date: {
							[Op.between]: [searchParams.start_date, searchParams.end_date],
						},
					}),
			},
			attributes: ["purchase_id", "party_name", "amount", "payment", "outstand", "details", "challan", "purchase_date"],
			order: [["purchase_date", "ASC"]],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public findAll = async () => {
		return await Purchase.findAll({
			attributes: ["purchase_id", "party_name", "amount", "payment", "outstand", "details", "challan", "purchase_date"],
			raw: true,
		});
	};

	public findOne = async (searchObject: any) => {
		return await Purchase.findOne({
			where: {
				...searchObject,
			},
			attributes: ["purchase_id", "party_name", "amount", "payment", "outstand", "details", "challan", "purchase_date"],
			raw: true,
		});
	};

	public create = async (purchaseData: createPurchaseDTO) => {
		await Purchase.create(purchaseData);
		return "purchase Data Added successfully";
	};

	public edit = async (purchaseData: EditPurchaseDTO, purchase_id: number) => {
		return await Purchase.update(purchaseData, { where: { purchase_id: purchase_id } }).then(() => {
			return "Purchase  Data Edit successfully";
		});
	};
}
