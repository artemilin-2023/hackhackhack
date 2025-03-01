import $api from "shared/api/api";
import { AxiosResponse } from "axios";
import { ILotResponse, ICreateLotProps } from "./Lots.model";

export default class CopywriterService {
	static async getLots(page_number: number, page_size: number): Promise<AxiosResponse<ILotResponse>> {
		return $api.get<ILotResponse>(`/lots/?page_size=${page_size}&page_number=${page_number}`);
	}

	static async createOne(lot: ICreateLotProps): Promise<AxiosResponse<any>> {
		return $api.post<any>("/lots", lot)
	}
}
