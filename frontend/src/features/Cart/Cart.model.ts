export interface ICartItem {
    lot_id: number;
    requested_weight: number;
    price_per_ton: number;
    oil_type: string;
    oil_pump?: {
        name: string;
        region: string;
    };
}

export interface ICart {
    items: ICartItem[];
    total_price: number;
} 