import { ChestDetails } from "../models";

export default class ChestDetailsService {
	public findAll = async () => {
		return await ChestDetails.findAndCountAll({
			attributes: ["chest_id", "chest", "mudho_golai", "mudho", "cross_bay", "ba_mudho_down", "so_down"],
			raw: true,
		});
	};
}
