import $api from "shared/api/api";
import { AxiosResponse } from "axios";
import { ILotResponse, ICreateLotProps } from "./Lots.model";

export default class LotsService {
	static async getLots(
		page_number: number, 
		page_size: number,
		sort_by?: string,
		sort_desc?: boolean,
		status?: "Подтвержден" | "Продан" | "Неактивен",
		oil_type?: "АИ-92" | "АИ-95" | "АИ-92 Экто" | "АИ-95 Экто" | "ДТ",
		min_price?: number,
		max_price?: number,
		oil_pump_name?: string,
		
		region?: string,
		available_weight_min?: number,
		search?: string
	): Promise<AxiosResponse<ILotResponse>> {
		const params = new URLSearchParams({
			page: page_number.toString(),
			size: page_size.toString(),
			...(sort_by && { sort_by }),
			...(sort_desc !== undefined && { sort_desc: sort_desc.toString() }),
			...(status && { status }),
			...(oil_type && { oil_type }),
			...(min_price && { min_price: min_price.toString() }),
			...(max_price && { max_price: max_price.toString() }),
			...(oil_pump_name && { oil_pump_name }),
			...(region && { region }),
			...(available_weight_min && { available_weight_min: available_weight_min.toString() }),
			...(search && { search })
		});

		return $api.get<ILotResponse>(`/lots/?${params.toString()}`);
	}

	static async createOne(lot: ICreateLotProps): Promise<AxiosResponse<any>> {
		return $api.post<any>("/lots", lot)
	}

	static async uploadCSV(file: File): Promise<AxiosResponse<any>> {
        const formData = new FormData();
        formData.append('file', file);
        return $api.post<any>("/lots/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

	static async getActiveLots(
		page_number: number, 
		page_size: number,
		sort_by?: string,
		sort_desc?: boolean,
		oil_type?: "АИ-92" | "АИ-95" | "АИ-92 Экто" | "АИ-95 Экто" | "ДТ",
		min_price?: number,
		max_price?: number,
		region?: string,
		available_weight_min?: number,
		oil_pump_name?: string,
		search?: string
	): Promise<AxiosResponse<ILotResponse>> {
		const params = new URLSearchParams({
			page: page_number.toString(),
			size: page_size.toString(),
			...(sort_by && { sort_by }),
			...(sort_desc !== undefined && { sort_desc: sort_desc.toString() }),
			...(oil_type && { oil_type }),
			...(min_price && { min_price: min_price.toString() }),
			...(max_price && { max_price: max_price.toString() }),
			...(region && { region }),
			...(available_weight_min && { available_weight_min: available_weight_min.toString() }),
			...(oil_pump_name && { oil_pump_name }),
			...(search && { search })
		});

		return $api.get<ILotResponse>(`/lots/active?${params.toString()}`);
	}

	static async getPumpNames(): Promise<AxiosResponse<Array<string>>> {
		return $api.get<Array<string>>("/oil-pumps/names");
	}

	static async patchLot(lot_id: number, update: ICreateLotProps): Promise<AxiosResponse<any>> {
		return $api.patch<any>(`/lots/${lot_id}`, update);
	}
}
