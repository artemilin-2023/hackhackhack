
import styles from './IndexPage.module.css'

export const IndexPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Добро пожаловать в HackStore</h1>
                <p className={styles.subtitle}>
                    Ваша надежная платформа для покупки и продажи цифровых товаров
                </p>
            </div>

            <div className={styles.features}>
                <div className={styles.featureCard}>
                    <h3 className={styles.featureTitle}>Безопасные транзакции</h3>
                    <p className={styles.featureDescription}>
                        Все транзакции защищены шифрованием промышленного стандарта
                    </p>
                </div>
                
                <div className={styles.featureCard}>
                    <h3 className={styles.featureTitle}>Широкий выбор</h3>
                    <p className={styles.featureDescription}>
                        Просматривайте тысячи цифровых товаров от проверенных продавцов
                    </p>
                </div>
                
                <div className={styles.featureCard}>
                    <h3 className={styles.featureTitle}>Поддержка 24/7</h3>
                    <p className={styles.featureDescription}>
                        Наша команда поддержки всегда готова помочь с любыми вопросами
                    </p>
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
        </div>
    )
}
