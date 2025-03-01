
import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

import AuthService from "features/Auth/AuthService";
import LotsService from "features/Lots/LotsService"



import { IRegisterProps, IUser } from "features/Auth/Auth.model"
import { ILot, ICreateLotProps } from "features/Lots/Lots.model" 

class Store {

	user: IUser | null = null;
	lots: ILot[] | null = null

	constructor() {
		makeAutoObservable(this);
		this.getMe();
		this.getLots(1, 20);
		console.log(this.lots)
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

	async getLots(page_size: number, page_number: number) {
		const response = await LotsService.getLots(page_size, page_number)	
		this.lots = response.data.lots
	}

	async createOne(lot: ICreateLotProps) {
		await LotsService.createOne(lot)	
	}
}


export const store = new Store();

export const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);
