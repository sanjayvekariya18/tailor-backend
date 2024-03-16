export default class ChestDetailsValidation {
	public create = {
		chest: "required|string",
		mudho_golai: "required|string",
		mudho: "required|string",
		cross_bay: "required|string",
		ba_mudho_down: "required|string",
		so_down: "required|string",
	};
	public edit = {
		chest: "string",
		mudho_golai: "string",
		mudho: "string",
		cross_bay: "string",
		ba_mudho_down: "string",
		so_down: "string",
	};
}
