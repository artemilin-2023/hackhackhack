import $api from "shared/api/api";
import { AxiosResponse } from "axios";

export default class DashboardService {
	static async getDashboardData(): Promise<AxiosResponse<any>> {
		return $api.get<any>("/dashboard");
	}
}   
