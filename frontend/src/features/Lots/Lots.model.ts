export interface ILotResponse {
	items: [
		INewLot
	]
	pagination: {
		total_pages: number;
		current_page: number;
		has_next: boolean;
		has_prev: boolean;
	}
}

export interface ILot {
	id: number,
	title: string,
	description: string,
	price: number,
	seller_id: number,
}

export interface ICreateLotProps {
	title: string;
	description: string;
	price: number;
}

export interface INewLot {
	id: number;
	lot_expiration_date: string;
	ksss_nb_code: number;
	ksss_fuel_code: number;
	initial_weight: number;
	available_weight: number;
	status: "Подтвержден" | "Продан" | "Неактивен";
	total_price: number;
	price_per_ton: number;
	oil_type: "АИ-92" | "АИ-95" | "АИ-92 Экто" | "АИ-95 Экто" | "ДТ";
	oil_pump?: {
		id: number;
		name: string;
		region: string;
	};
}

export interface IPatchLotProps {
	lot_expiration_date: string;
	available_weight: number;
	status: "Подтвержден" | "Продан" | "Неактивен";
	total_price: number;
	price_per_ton: number;
}