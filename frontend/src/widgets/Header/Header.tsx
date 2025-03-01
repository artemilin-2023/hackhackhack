import { Link } from "react-router-dom"
import styles from './Header.module.css'

export const Header = () => {
    return (
        <header className={styles.HeaderWrapper}>
            <div className={styles.Header}>
                <Link to="/" className={styles.Logo}>
                    HackStore
                </Link>
            <nav className={styles.Nav}>
                    <Link to="/products" className={styles.NavLink}>Товары</Link>
                    <Link to="/cart" className={styles.NavLink}>Корзина</Link>
                    <Link to="/auth" className={styles.NavLink + ' ' + styles.authButton}>Войти</Link>
                </nav>
            </div>
        </header>
    )
}
