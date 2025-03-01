import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

import AuthService from "features/Auth/AuthService";
import LotsService from "features/Lots/LotsService"

import { IRegisterProps, IUser } from "features/Auth/Auth.model"
import { INewLot, ICreateLotProps } from "features/Lots/Lots.model" 
import { ICartItem } from "features/Cart/Cart.model";

class Store {
	user: IUser | null = null;
	
	lots: INewLot[] = []
	activeLot: INewLot | null = null
	pumpNames: Array<string> = []

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

	cart: ICartItem[] = [];

	constructor() {
		makeAutoObservable(this);
		this.getMe();
		if (this.user) { 
			this.getLots(1, 6);
		}	
		this.getPumpNames();
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
		sort_desc?: boolean,
		search?: string,
		oil_type?: string,
		oil_pump_name?: string
	) {
		try {
			let response;
			
			if (this.user?.role === "admin") {
				// Для админа используем обычный эндпоинт /lots
				response = await LotsService.getLots(
					page_number, 
					page_size, 
					sort_by,
					sort_desc,
					"Подтвержден", // status
					oil_type as "АИ-92" | "АИ-95" | "АИ-92 Экто" | "АИ-95 Экто" | "ДТ" | undefined, // oil_type
					undefined, // min_price
					undefined, // max_price
					oil_pump_name, // oil_pump_name
					undefined, // region
					undefined, // available_weight_min
					search
				);
			} else {
				// Для обычных пользователей используем эндпоинт /lots/active
				response = await LotsService.getActiveLots(
					page_number, 
					page_size, 
					sort_by,
					sort_desc,
					oil_type as "АИ-92" | "АИ-95" | "АИ-92 Экто" | "АИ-95 Экто" | "ДТ" | undefined, // oil_type
					undefined, // min_price
					undefined, // max_price
					undefined, // region
					undefined, // available_weight_min
					oil_pump_name, // oil_pump_name
					search
				);
			}
			
			this.lots = response.data.items as unknown as INewLot[];
			this.pagination = response.data.pagination;
		} catch (error) {
			console.error('Error fetching lots:', error);
		}
	}

	async getAdminLots(
		page_number: number, 
		page_size: number, 
		sort_by?: string,
		sort_desc?: boolean,
		search?: string,
		oil_type?: string,
		oil_pump_name?: string
	) {
		try {
			// Для админ-панели всегда используем обычный эндпоинт /lots
			const response = await LotsService.getLots(
				page_number, 
				page_size, 
				sort_by,
				sort_desc,
				undefined, // status
				oil_type as "АИ-92" | "АИ-95" | "АИ-92 Экто" | "АИ-95 Экто" | "ДТ" | undefined, // oil_type
				undefined, // min_price
				undefined, // max_price
				oil_pump_name, // oil_pump_name
				undefined, // region
				undefined, // available_weight_min
				search
			);
			this.lots = response.data.items as unknown as INewLot[];
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
		await this.getLots(1, 6);
	}

	setActiveLot(lot: INewLot | null) {
		this.activeLot = lot;
	}

	addToCart(item: ICartItem) {
		const existingItem = this.cart.find(cartItem => cartItem.lot_id === item.lot_id);
		if (existingItem) {
			existingItem.requested_weight = item.requested_weight;
		} else {
			this.cart.push(item);
		}
	}

	removeFromCart(lotId: number) {
		this.cart = this.cart.filter(item => item.lot_id !== lotId);
	}

	async getPumpNames() {
		const response = await LotsService.getPumpNames();
		this.pumpNames = response.data;
	}

	get cartTotalPrice() {
		return this.cart.reduce((total, item) => {
			return total + (item.requested_weight * item.price_per_ton);
		}, 0);
	}
}

export const store = new Store();

export const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);
