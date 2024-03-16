export class CreateChestDetailsDTO {
	chest: string;
	mudho_golai: string;
	mudho: string;
	cross_bay: string;
	ba_mudho_down: string;
	so_down: string;
	constructor(data: any) {
		this.chest = data.chest;
		this.mudho_golai = data.mudho_golai;
		this.mudho = data.mudho;
		this.cross_bay = data.cross_bay;
		this.ba_mudho_down = data.ba_mudho_down;
		this.so_down = data.so_down;
	}
}

export class EditChestDetailsDTO {
	chest?: string;
	mudho_golai?: string;
	mudho?: string;
	cross_bay?: string;
	ba_mudho_down?: string;
	so_down?: string;
	constructor(data: any) {
		data.chest != undefined ? (this.chest = data.chest) : delete this.chest;
		data.mudho_golai != undefined ? (this.mudho_golai = data.mudho_golai) : delete this.mudho_golai;
		data.mudho != undefined ? (this.mudho = data.mudho) : delete this.mudho;
		data.cross_bay != undefined ? (this.cross_bay = data.cross_bay) : delete this.cross_bay;
		data.ba_mudho_down != undefined ? (this.ba_mudho_down = data.ba_mudho_down) : delete this.ba_mudho_down;
		data.so_down != undefined ? (this.so_down = data.so_down) : delete this.so_down;
	}
}
