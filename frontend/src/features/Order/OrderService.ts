import $api from "shared/api/api";
import { AxiosResponse } from "axios";
import { INewLot } from "features/Lots/Lots.model";

type DeliveryType = "Самовывоз" | "Доставка"

export interface IOrder {
	lot_id: number;
	quantity: number;
    delivery_type: DeliveryType;
}

export default class OrderService {
	static async createOrder(order: IOrder): Promise<AxiosResponse<INewLot[]>> {
		return $api.post<INewLot[]>("/orders", { order } )
	}

	static async getOrders(): Promise<AxiosResponse<INewLot[]>> {
		return $api.get<INewLot[]>("/orders")
	}
}
