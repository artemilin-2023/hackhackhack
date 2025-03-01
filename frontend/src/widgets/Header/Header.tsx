import { NavLink } from "react-router-dom"
import { useStore } from "shared/store/store"
import { observer } from "mobx-react-lite"
import styles from './Header.module.css'

export const Header = observer(() => {
	const store = useStore()

	return (
		<header className={styles.HeaderWrapper}>
			<div className={styles.Header}>
				<NavLink to="/" className={styles.Logo}>
					HackStore
				</NavLink>
				<nav className={styles.Nav}>
					<NavLink
						to="/lots"
						className={({ isActive }) =>
							isActive ? `${styles.NavLink} ${styles.active}` : styles.NavLink
						}
					>
						Товары
					</NavLink>
					<NavLink
						to="/cart"
						className={({ isActive }) =>
							isActive ? `${styles.NavLink} ${styles.active}` : styles.NavLink
						}
					>
						Корзина
					</NavLink>
					{store.user === null ? (
						<NavLink
							to="/auth"
							className={({ isActive }) =>
								isActive
									? `${styles.NavLink} ${styles.authButton} ${styles.active}`
									: `${styles.NavLink} ${styles.authButton}`
							}
						>
							Войти
						</NavLink>
					) : (
						<NavLink
							to="/personal"
							className={({ isActive }) =>
								isActive ? `${styles.NavLink} ${styles.active}` : styles.NavLink
							}
						>
							Личный кабинет
						</NavLink>
					)}
					{store.user && store.user?.role === "admin" && (

						<NavLink
							to="/admin"
							className={({ isActive }) =>
								isActive
									? `${styles.NavLink} ${styles.authButton} ${styles.active}`
									: `${styles.NavLink} ${styles.authButton}`
							}
						>
							Админ-панель
						</NavLink>
					)}
				</nav>
			</div>
		</header>
	)
})
