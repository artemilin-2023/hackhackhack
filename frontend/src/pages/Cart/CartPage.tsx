import { observer } from 'mobx-react-lite';
import { useStore } from 'shared/store/store';
import { Button } from 'shared/ui/button';
import styles from './CartPage.module.css';

export const CartPage = observer(() => {
    const store = useStore();

    if (store.cart.length === 0) {
        return (
            <div className={styles.empty}>
                <h2>Корзина пуста</h2>
                <p>Добавьте товары из каталога</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1>Корзина</h1>
            <div className={styles.items}>
                {store.cart.map((item) => (
                    <div key={item.lot_id} className={styles.cartItem}>
                        <div className={styles.itemInfo}>
                            <h3>{item.oil_type}</h3>
                            {item.oil_pump && (
                                <div className={styles.pump}>
                                    <p>{item.oil_pump.name}</p>
                                    <span>{item.oil_pump.region}</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.itemDetails}>
                            <div className={styles.weight}>
                                <span>Количество:</span>
                                <p>{item.requested_weight} т</p>
                            </div>
                            <div className={styles.price}>
                                <span>Цена за тонну:</span>
                                <p>{item.price_per_ton} ₽</p>
                            </div>
                            <div className={styles.total}>
                                <span>Итого:</span>
                                <p>{item.requested_weight * item.price_per_ton} ₽</p>
                            </div>
                        </div>
                        <Button 
                            variant="destructive"
                            onClick={() => store.removeFromCart(item.lot_id)}
                        >
                            Удалить
                        </Button>
                    </div>
                ))}
            </div>
            <div className={styles.summary}>
                <div className={styles.totalPrice}>
                    <h3>Итого к оплате:</h3>
                    <p>{store.cartTotalPrice} ₽</p>
                </div>
                <Button className={styles.checkoutButton}>
                    Оформить заказ
                </Button>
            </div>
        </div>
    );
}); 