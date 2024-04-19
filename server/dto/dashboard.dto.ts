export default class PaginationData {
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		this.page = data.page != undefined && data.page != "" ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined && data.rowsPerPage != "" ? Number(data.rowsPerPage) : 10;
	}
}
