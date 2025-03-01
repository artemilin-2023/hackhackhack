export interface ILotResponse {
	lots: [
		ILot
	]

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
	id: number,
	order_date: string,
	lot_id: number,
	ksss_nb_code: number,
	ksss_fuel_code: number,
	volume: number,
	delivery_type: string,
	customer_id: number,
	status: "Ожидание" | "Выполнен" | "Отменен"
}
