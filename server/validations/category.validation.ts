import { CATEGORY_TYPE } from "../models/category.model";

export default class CategoryValidation {
	public getAll = {
		is_active: "boolean",
		searchTxt: "string",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		category_name: "required|string",
		category_type: "required|in:" + Object.keys(CATEGORY_TYPE),
	};
}
