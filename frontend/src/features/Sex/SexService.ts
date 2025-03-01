import $api from "shared/api/api";
import { AxiosResponse } from "axios";

type SexResponse = "Не было"

export default class SexService {
	static async getSex(): Promise<AxiosResponse<SexResponse>> {
		return $api.get<SexResponse>("/sex")
	}
}
