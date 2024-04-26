export class SearchMeasurementDTO {
	searchTxt?: string;
	category_id?: number;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.searchTxt != undefined ? (this.searchTxt = data.searchTxt.trim()) : delete this.searchTxt;
		data.category_id != undefined ? (this.category_id = data.category_id) : delete this.category_id;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}

export class CreateMeasurementDTO {
	category_id: number;
	measurement_name: string;
	constructor(data: any) {
		this.category_id = data.category_id;
		this.measurement_name = data.measurement_name;
	}
}
