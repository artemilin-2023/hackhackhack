import $api from "shared/api/api";
import { AxiosResponse } from "axios";
import { INewLot } from "features/Lots/Lots.model";

type DeliveryType = "Самовывоз" | "Доставка"

export interface IOrder {
	lot_id: number;
	volume: number;
    delivery_type: DeliveryType;
}

interface IOrderResponse {
	items: INewLot[];
    pagination: {
        total_pages: number;
        current_page: number;
        has_next: boolean;
        has_prev: boolean;
        total_items: number;
        page_size: number;
    };
}

export default class OrderService {
	static async createOrder(order: IOrder): Promise<AxiosResponse<INewLot[]>> {
		return $api.post<INewLot[]>("/orders", { orders: [order] } )
	}

	static async getOrders(
		page_number: number = 1, 
		page_size: number = 10,
		sort_by?: string,
		sort_desc?: boolean,
		status?: string,
		min_volume?: number,
		max_volume?: number,
		start_date?: string,
		end_date?: string,
		delivery_type?: DeliveryType
	): Promise<AxiosResponse<IOrderResponse>> {
		const params = new URLSearchParams({
			page: page_number.toString(),
			size: page_size.toString(),
			...(sort_by && { sort_by }),
			...(sort_desc !== undefined && { sort_desc: sort_desc.toString() }),
			...(status && { status }),
			...(min_volume && { min_volume: min_volume.toString() }),
			...(max_volume && { max_volume: max_volume.toString() }),
			...(start_date && { start_date }),
			...(end_date && { end_date }),
			...(delivery_type && { delivery_type })
		});

		return $api.get<IOrderResponse>(`/orders/my?${params.toString()}`);
	}
}
