import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

import AuthService from "features/Auth/AuthService";
import LotsService from "features/Lots/LotsService"

import { IRegisterProps, IUser } from "features/Auth/Auth.model"
import { INewLot, ICreateLotProps } from "features/Lots/Lots.model" 

class Store {
	user: IUser | null = null;
	
	lots: INewLot[] = [
		{
			id: 1,
			lot_expiration_date: "2024-04-01",
			ksss_nb_code: 12345,
			ksss_fuel_code: 67890,
			initial_weight: 1000,
			available_weight: 800,
			status: "Подтвержден",
			total_price: 150000,
			price_per_ton: 150,
			oil_type: "АИ-92",
			oil_pump: {
				id: 1,
				name: "НБ Санкт-Петербург",
				region: "Ленинградская область"
			}
		},
		{
			id: 2,
			lot_expiration_date: "2024-04-15",
			ksss_nb_code: 23456,
			ksss_fuel_code: 78901,
			initial_weight: 2000,
			available_weight: 2000,
			status: "Неактивен",
			total_price: 300000,
			price_per_ton: 150,
			oil_type: "АИ-92",
			oil_pump: {
				id: 2,
				name: "НБ Москва",
				region: "Московская область"
			}
		},
		{
			id: 3,
			lot_expiration_date: "2024-03-30",
			ksss_nb_code: 34567,
			ksss_fuel_code: 89012,
			initial_weight: 1500,
			available_weight: 0,
			status: "Продан",
			total_price: 225000,
			price_per_ton: 150,
			oil_type: "АИ-92",
			oil_pump: {
				id: 3,
				name: "НБ Казань",
				region: "Республика Татарстан"
			}
		},
		{
			id: 4,
			lot_expiration_date: "2024-04-01",
			ksss_nb_code: 12345,
			ksss_fuel_code: 67890,
			initial_weight: 1000,
			available_weight: 800,
			status: "Подтвержден",
			total_price: 150000,
			price_per_ton: 150,
			oil_type: "АИ-92",
			oil_pump: {
				id: 4,
				name: "НБ Новосибирск",
				region: "Новосибирская область"
			}
		},
		{
			id: 5,
			lot_expiration_date: "2024-04-01",
			ksss_nb_code: 12345,
			ksss_fuel_code: 67890,
			initial_weight: 1000,
			available_weight: 800,
			status: "Подтвержден",
			total_price: 150000,
			price_per_ton: 150,
			oil_type: "АИ-92",
			oil_pump: {
				id: 5,
				name: "НБ Екатеринбург",
				region: "Свердловская область"
			}
		},
		{
			id: 6,
			lot_expiration_date: "2024-04-01",
			ksss_nb_code: 12345,
			ksss_fuel_code: 67890,
			initial_weight: 1000,
			available_weight: 800,
			status: "Подтвержден",
			total_price: 150000,
			price_per_ton: 150,
			oil_type: "АИ-92",
			oil_pump: {
				id: 6,
				name: "НБ Краснодар",
				region: "Краснодарский край"
			}
		}
	];

	pagination: {
		total_pages: number;
		current_page: number;
		has_next: boolean;
		has_prev: boolean;
	} = {
		total_pages: 0,
		current_page: 0,
		has_next: false,
		has_prev: false,
	}

	constructor() {
		makeAutoObservable(this);
		this.getMe();
	}

	async login(email: string, password: string) {
		const response = await AuthService.login(email, password);
		this.user = response.user;
	}

	async register({ name, email, password, role }: IRegisterProps) {
		const response = await AuthService.register({ name, email, password, role });
		this.user = response.user;
	}

	async getMe() {
		const response = await AuthService.getMe();
		this.user = response.data;
	}

	async logout() {
		await AuthService.logOut();
		this.user = null
	}

	async getLots(
		page_number: number, 
		page_size: number, 
		sort_by?: string,
		sort_desc?: boolean
	) {
		try {
			const response = await LotsService.getLots(
				page_number, 
				page_size, 
				sort_by, 
				sort_desc
			);
			this.lots = response.data.lots as unknown as INewLot[];
			this.pagination = response.data.pagination;
		} catch (error) {
			console.error('Error fetching lots:', error);
		}
	}

	async createOne(lot: ICreateLotProps) {
		await LotsService.createOne(lot)	
	}

	async uploadCSV(file: File) {
		await LotsService.uploadCSV(file);
		await this.getLots(1, 20); 
	}

}

export const store = new Store();

export const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);
