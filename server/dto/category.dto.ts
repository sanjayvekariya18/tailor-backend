export class SearchCategoryDTO {
	searchTxt?: string;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.searchTxt != undefined ? (this.searchTxt = data.searchTxt) : delete this.searchTxt;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}

export class CreateCategoryDTO {
	category_name: string;
	category_image: string;
	constructor(data: any) {
		this.category_name = data.category_name;
		this.category_image = data.category_image;
	}
}

export class EditCategoryDTO {
	category_name: string;
	category_image?: string;

	constructor(data: any) {
		this.category_name = data.category_name;
	}
}
