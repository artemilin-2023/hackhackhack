import $api from "shared/api/api";
import { AxiosResponse } from "axios"
import { IRegisterProps, IUser } from "./Auth.model"

export default class AuthService {

	static async login(email: string, password: string) {
		const response = await $api.post("/login", { email, password });
		return response.data;
	}

	static async register({ name, email, password }: IRegisterProps) {
		const response = await $api.post("/register", { name, email, password, role: "customer" });
		return response.data;
	}
	static async logOut() {
		const response = await $api.get("/logout")
		return response.data
	}

	static async getMe(): Promise<AxiosResponse<IUser>> {
		return $api.get<IUser>("/me");
	}

}
