export class CreateOrderImageDTO {
	order_id: number;
	image_name: string;
	constructor(data: any) {
		this.order_id = data.order_id;
		this.image_name = data.image_name;
	}
}

export class EditOrderImageDTO {
	order_id?: number;
	image_name?: string;
	constructor(data: any) {
		data.order_id != undefined ? (this.order_id = data.order_id) : delete this.order_id;
		data.image_name != undefined ? (this.image_name = data.image_name) : delete this.image_name;
	}
}
