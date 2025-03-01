import styles from './IndexPage.module.css'
import { useStore } from 'shared/store/store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'shared/ui/button'

export const IndexPage = () => {
    const store = useStore()
    const navigate = useNavigate()
    
    useEffect(() => {
        // Загружаем несколько популярных товаров для отображения на главной
        store.getLots(1, 3, 'price_per_ton', true)
    }, [])
    
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Добро пожаловать в HackStore</h1>
                    <p className={styles.subtitle}>
                        Ваша надежная платформа для покупки и продажи цифровых товаров
                    </p>
                    <div className={styles.heroButtons}>
                        <Button onClick={() => navigate('/lots')} className={styles.primaryButton}>
                            Просмотреть каталог
                        </Button>
                        <Button onClick={() => navigate('/auth')} variant="outline" className={styles.secondaryButton}>
                            Создать аккаунт
                        </Button>
                    </div>
                </div>
            </div>

            <div className={styles.features}>
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>🔒</div>
                    <h3 className={styles.featureTitle}>Безопасные транзакции</h3>
                    <p className={styles.featureDescription}>
                        Все транзакции защищены шифрованием промышленного стандарта
                    </p>
                </div>
                
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>🛒</div>
                    <h3 className={styles.featureTitle}>Широкий выбор</h3>
                    <p className={styles.featureDescription}>
                        Просматривайте тысячи цифровых товаров от проверенных продавцов
                    </p>
                </div>
                
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>🛟</div>
                    <h3 className={styles.featureTitle}>Поддержка 24/7</h3>
                    <p className={styles.featureDescription}>
                        Наша команда поддержки всегда готова помочь с любыми вопросами
                    </p>
                </div>
            </div>

            <div className={styles.popularProducts}>
                <h2 className={styles.sectionTitle}>Популярные товары</h2>
                <div className={styles.productsGrid}>
                    {store.lots && store.lots.length > 0 ? (
                        store.lots.map(lot => (
                            <div key={lot.id} className={styles.productCard} onClick={() => navigate(`/lots/${lot.id}`)}>
                                <div className={styles.productType}>{lot.oil_type}</div>
                                <div className={styles.productDetails}>
                                    {lot.oil_pump && (
                                        <div className={styles.productLocation}>
                                            {lot.oil_pump.name}, {lot.oil_pump.region}
                                        </div>
                                    )}
                                    <div className={styles.productPrice}>
                                        <span>{Math.round(lot.price_per_ton)} ₽</span> за тонну
                                    </div>
                                    <div className={styles.productWeight}>
                                        Доступно: <span>{Math.round(lot.available_weight)} т</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.loadingProducts}>
                            <p>Загрузка популярных товаров...</p>
                        </div>
                    )}
                </div>
                <div className={styles.viewAllContainer}>
                    <Button onClick={() => navigate('/lots')} variant="outline" className={styles.viewAllButton}>
                        Смотреть все товары
                    </Button>
                </div>
            </div>

            <div className={styles.howItWorks}>
                <h2 className={styles.sectionTitle}>Как это работает</h2>
                <div className={styles.steps}>
                    <div className={`${styles.step} ${styles.stepLeft}`}>
                        <span className={styles.stepNumber}>1</span>
                        <h3 className={styles.stepTitle}>Создайте аккаунт</h3>
                        <p className={styles.stepDescription}>
                            Зарегистрируйтесь как покупатель или продавец всего за пару минут
                        </p>
                    </div>
                    <div className={`${styles.step} ${styles.stepRight}`}>
                        <span className={styles.stepNumber}>2</span>
                        <h3 className={styles.stepTitle}>Выберите товар</h3>
                        <p className={styles.stepDescription}>
                            Изучите каталог и найдите то, что вам нужно
                        </p>
                    </div>
                    <div className={`${styles.step} ${styles.stepLeft}`}>
                        <span className={styles.stepNumber}>3</span>
                        <h3 className={styles.stepTitle}>Безопасная оплата</h3>
                        <p className={styles.stepDescription}>
                            Оплатите покупку через нашу защищенную платежную систему
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.testimonials}>
                <h2 className={styles.sectionTitle}>Отзывы клиентов</h2>
                <div className={styles.testimonialsGrid}>
                    <div className={styles.testimonialCard}>
                        <div className={styles.testimonialContent}>
                            <p>"HackStore значительно упростил процесс закупки топлива для нашей компании. Интерфейс интуитивно понятен, а цены конкурентоспособны."</p>
                        </div>
                        <div className={styles.testimonialAuthor}>
                            <div className={styles.authorAvatar}>АК</div>
                            <div className={styles.authorInfo}>
                                <h4>Алексей Ковалев</h4>
                                <p>Директор по логистике, ТрансНефть</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.testimonialCard}>
                        <div className={styles.testimonialContent}>
                            <p>"Мы используем HackStore уже более года и очень довольны качеством сервиса. Особенно ценим оперативность поставок и прозрачность всех операций."</p>
                        </div>
                        <div className={styles.testimonialAuthor}>
                            <div className={styles.authorAvatar}>ЕС</div>
                            <div className={styles.authorInfo}>
                                <h4>Елена Смирнова</h4>
                                <p>Руководитель отдела закупок, ГазИнвест</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.testimonialCard}>
                        <div className={styles.testimonialContent}>
                            <p>"Отличная платформа для быстрой и удобной покупки топлива. Рекомендую всем, кто ценит свое время и хочет получить качественный сервис."</p>
                        </div>
                        <div className={styles.testimonialAuthor}>
                            <div className={styles.authorAvatar}>ДМ</div>
                            <div className={styles.authorInfo}>
                                <h4>Дмитрий Морозов</h4>
                                <p>Владелец сети АЗС "Автодрайв"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.cta}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaTitle}>Готовы начать?</h2>
                    <p className={styles.ctaDescription}>
                        Присоединяйтесь к тысячам компаний, которые уже оптимизировали свои закупки топлива с HackStore
                    </p>
                    <Button onClick={() => navigate('/auth')} className={styles.ctaButton}>
                        Создать аккаунт
                    </Button>
                </div>
            </div>
        </div>
    )
}
