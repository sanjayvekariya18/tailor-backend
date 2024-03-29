export class SearchWorkerDTO {
	searchTxt?: string;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.searchTxt != undefined ? (this.searchTxt = data.searchTxt) : delete this.searchTxt;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}
class CreateWorkerPriceDTO {
	category_id: string;
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
		this.worker_name = data.worker_name;
		this.worker_mobile = data.worker_mobile;
		this.worker_address = data.worker_address;
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
		// let parseData = JSON.parse("[{category_id:1,price:20}]");
		let parseData = [
			{
				category_id: "b2470be1-5801-43a7-8dbf-9aa64443e249",
				price: 100,
			},
			{
				category_id: "4744c903-9a99-4d2f-8747-f9be94c01832",
				price: 200,
			},
		];
		data.worker_name != undefined ? (this.worker_name = data.worker_name) : delete this.worker_name;
		data.worker_mobile != undefined ? (this.worker_mobile = data.worker_mobile) : delete this.worker_mobile;
		data.worker_address != undefined ? (this.worker_address = data.worker_address) : delete this.worker_address;
		data.worker_photo != undefined ? (this.worker_photo = data.worker_photo) : delete this.worker_photo;
		data.worker_proof != undefined ? (this.worker_proof = data.worker_proof) : delete this.worker_proof;
		parseData.forEach((workerPrice: CreateWorkerPriceDTO) => {
			this.worker_price.push(new CreateWorkerPriceDTO(workerPrice));
		});
	}
}
