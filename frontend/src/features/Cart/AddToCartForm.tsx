import { useState } from 'react';
import { Button } from 'shared/ui/button';
import { useStore } from 'shared/store/store';
import styles from './AddToCartForm.module.css';
import { INewLot } from 'features/Lots/Lots.model';
import { toast } from 'react-toastify';

export const AddToCartForm = ({ lot }: { lot: INewLot }) => {
    const [requestedWeight, setRequestedWeight] = useState(lot.available_weight);
    const store = useStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        store.addToCart({
            lot_id: lot.id,
            requested_weight: requestedWeight,
            price_per_ton: lot.price_per_ton,
            oil_type: lot.oil_type,
            oil_pump: lot.oil_pump
        });
        
        toast.success(`${lot.oil_type} успешно добавлен в корзину!`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.weightInput}>
                <label htmlFor="weight">Количество тонн:</label>
                <input
                    type="number"
                    id="weight"
                    min={1}
                    max={lot.available_weight}
                    value={requestedWeight}
                    onChange={(e) => setRequestedWeight(Number(e.target.value))}
                />
                <span className={styles.maxWeight}>
                    Доступно: {lot.available_weight} т
                </span>
            </div>
            <Button type="submit" className={styles.addButton}>
                Добавить в корзину
            </Button>
        </form>
    );
}; 