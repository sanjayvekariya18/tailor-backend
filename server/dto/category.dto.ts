import { CATEGORY_TYPE } from "../models/category.model";

export class SearchCategoryDTO {
	searchTxt?: string;
	category_type?: CATEGORY_TYPE;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.searchTxt != undefined && data.searchTxt != "" ? (this.searchTxt = data.searchTxt) : delete this.searchTxt;
		data.category_type != undefined && data.category_type != "" ? (this.category_type = data.category_type) : delete this.category_type;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}

export class CreateCategoryDTO {
	category_name: string;
	category_image: string;
	category_type: CATEGORY_TYPE;

	constructor(data: any) {
		this.category_name = data.category_name;
		this.category_image = data.category_image;
		this.category_type = data.category_type;
	}
}

export class EditCategoryDTO {
	category_name: string;
	category_image?: string;
	category_type: CATEGORY_TYPE;

	constructor(data: any) {
		this.category_name = data.category_name;
		this.category_type = data.category_type;
	}
}
