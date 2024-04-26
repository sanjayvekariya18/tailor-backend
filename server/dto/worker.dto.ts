export class SearchWorkerDTO {
	searchTxt?: string;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.searchTxt != undefined ? (this.searchTxt = data.searchTxt.trim()) : delete this.searchTxt;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}
class CreateWorkerPriceDTO {
	category_id: number;
	price: number;
	constructor(data: any) {
		this.category_id = data.category_id;
		this.price = data.price;
	}
}

export class CreateWorkerDTO {
	worker_name: string;
	worker_mobile: string;
	worker_address: string;
	worker_photo: string;
	worker_proof: string;
	worker_price: Array<CreateWorkerPriceDTO> = [];
	constructor(data: any) {
		let parseData = JSON.parse(data.worker_price);
		this.worker_name = data.worker_name.trim();
		this.worker_mobile = data.worker_mobile.trim();
		this.worker_address = data.worker_address.trim();
		this.worker_photo = data.worker_photo;
		this.worker_proof = data.worker_proof;
		parseData.forEach((workerPrice: CreateWorkerPriceDTO) => {
			this.worker_price.push(new CreateWorkerPriceDTO(workerPrice));
		});
	}
}

export class EditWorkerDTO {
	worker_name?: string;
	worker_mobile?: string;
	worker_address?: string;
	worker_photo?: string;
	worker_proof?: string;
	worker_price: Array<CreateWorkerPriceDTO> = [];
	constructor(data: any) {
		let parseData = [];
		if (data.worker_price != undefined) {
			parseData = JSON.parse(data.worker_price);
		}
		data.worker_name != undefined ? (this.worker_name = data.worker_name.trim()) : delete this.worker_name;
		data.worker_mobile != undefined ? (this.worker_mobile = data.worker_mobile.trim()) : delete this.worker_mobile;
		data.worker_address != undefined ? (this.worker_address = data.worker_address.trim()) : delete this.worker_address;
		data.worker_photo != undefined ? (this.worker_photo = data.worker_photo) : delete this.worker_photo;
		data.worker_proof != undefined ? (this.worker_proof = data.worker_proof) : delete this.worker_proof;
		parseData.forEach((workerPrice: CreateWorkerPriceDTO) => {
			this.worker_price.push(new CreateWorkerPriceDTO(workerPrice));
		});
	}
}

export class WorkerAssignTaskDTO {
	worker_id: number;
	customer_id: number;
	constructor(data: any) {
		this.worker_id = data.worker_id;
		this.customer_id = data.customer_id;
	}
}
