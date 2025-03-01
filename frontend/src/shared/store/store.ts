
import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

import { AuthService } from "features/Auth/AuthService";
import { IRegisterProps } from "features/Auth/Auth.model"

class Store {

	user = null;

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
		this.user = response.user;
	}

	async logout() {
		await AuthService.logOut();
		this.user = null
	}
}


export const store = new Store();

export const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);
