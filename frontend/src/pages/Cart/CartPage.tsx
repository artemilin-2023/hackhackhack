import { observer } from 'mobx-react-lite';
import { useStore } from 'shared/store/store';
import { Button } from 'shared/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './CartPage.module.css';

export const CartPage = observer(() => {
    const store = useStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [deliveryType, setDeliveryType] = useState<'Самовывоз' | 'Доставка'>('Самовывоз');

    if (store.cart.length === 0) {
        return (
            <div className={styles.empty}>
                <h2>Корзина пуста</h2>
                <p>Добавьте товары из каталога</p>
                <Button 
                    className={styles.browseButton}
                    onClick={() => navigate('/lots')}
                >
                    Перейти в каталог
                </Button>
            </div>
        );
    }

    const handleCheckout = async () => {
        if (!store.user) {
            navigate('/auth');
            return;
        }

        setIsProcessing(true);
        try {
            for (const item of store.cart) {
                await store.createOrder({
                    lot_id: item.lot_id,
                    quantity: item.requested_weight,
                    delivery_type: deliveryType
                });
            }
            
            store.cart = [];
            toast.success('Заказ успешно оформлен!');
            navigate('/personal');
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте снова.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Корзина</h1>
                <p className={styles.itemCount}>{store.cart.length} {getItemsText(store.cart.length)}</p>
            </div>
            
            <div className={styles.content}>
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
                                    <p>{item.price_per_ton.toLocaleString()} ₽</p>
                                </div>
                                <div className={styles.total}>
                                    <span>Итого:</span>
                                    <p>{(item.requested_weight * item.price_per_ton).toLocaleString()} ₽</p>
                                </div>
                            </div>
                            <Button 
                                variant="destructive"
                                onClick={() => store.removeFromCart(item.lot_id)}
                                className={styles.removeButton}
                            >
                                Удалить
                            </Button>
                        </div>
                    ))}
                </div>
                
                <div className={styles.orderSummary}>
                    <div className={styles.summaryCard}>
                        <h2>Сводка заказа</h2>
                        
                        <div className={styles.summaryDetails}>
                            <div className={styles.summaryRow}>
                                <span>Товары ({store.cart.length}):</span>
                                <span>{store.cartTotalPrice.toLocaleString()} ₽</span>
                            </div>
                            
                            <div className={styles.deliveryOptions}>
                                <h3>Способ получения:</h3>
                                <div className={styles.deliverySelector}>
                                    <button 
                                        className={`${styles.deliveryOption} ${deliveryType === 'Самовывоз' ? styles.selected : ''}`}
                                        onClick={() => setDeliveryType('Самовывоз')}
                                    >
                                        Самовывоз
                                    </button>
                                    <button 
                                        className={`${styles.deliveryOption} ${deliveryType === 'Доставка' ? styles.selected : ''}`}
                                        onClick={() => setDeliveryType('Доставка')}
                                    >
                                        Доставка
                                    </button>
                                </div>
                            </div>
                            
                            <div className={styles.divider}></div>
                            
                            <div className={styles.totalPrice}>
                                <h3>Итого к оплате:</h3>
                                <p>{store.cartTotalPrice.toLocaleString()} ₽</p>
                            </div>
                        </div>
                        
                        <Button 
                            className={styles.checkoutButton}
                            onClick={handleCheckout}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Оформление...' : 'Оформить заказ'}
                        </Button>
                        
                        <Button 
                            variant="outline" 
                            className={styles.continueShoppingButton}
                            onClick={() => navigate('/lots')}
                        >
                            Продолжить покупки
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

function getItemsText(count: number): string {
    if (count % 10 === 1 && count % 100 !== 11) {
        return 'товар';
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
        return 'товара';
    } else {
        return 'товаров';
    }
} 