import $api from "shared/api/api";
import { IRegisterProps } from "./Auth.model"


export const AuthService = {
	async login(email: string, password: string) {
		const response = await $api.post("/login", { email, password });
		return response.data;
	},
	async register({ name, email, password, role }: IRegisterProps) {
		const response = await $api.post("/register", { name, email, password, role });
		return response.data;
	},
	async getMe() {
		const response = await $api.get("/me");
		return response.data;
	},
	async logOut() {
		const response = await $api.get("/logout")
		return response.data
	}
}
