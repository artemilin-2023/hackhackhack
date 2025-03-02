import { NavLink } from "react-router-dom"
import { useStore } from "shared/store/store"
import { observer } from "mobx-react-lite"
import { useState, useEffect } from "react"
import { HiOutlineX, HiOutlineMenu, HiOutlineShoppingCart, HiOutlineUser, HiOutlineLogin, HiOutlineShoppingBag, HiOutlineCog } from "react-icons/hi"
import styles from './Header.module.css'
import useWindowDimensions from "shared/lib/dimension"

export const Header = observer(() => {
	const store = useStore()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const { width } = useWindowDimensions()
	
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}
	
	// Блокировка прокрутки страницы при открытом меню
	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'auto'
		}
		
		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [isMenuOpen])
	
	// Закрытие меню при переходе на десктопный размер
	useEffect(() => {
		if (width > 768 && isMenuOpen) {
			setIsMenuOpen(false)
		}
	}, [width, isMenuOpen])

	return (
		<header className={styles.HeaderWrapper}>
			<div className={styles.Header}>
				<NavLink to="/" className={styles.Logo}>
					HackStore
				</NavLink>
			
			{width <= 768 && (
				<button 
				className={styles.mobileMenuButton} 
				onClick={toggleMenu}
				aria-label="Меню"
			>
				{isMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
			</button>

				)}
				
				{/* Overlay для закрытия меню при клике вне его */}
				<div 
					className={`${styles.overlay} ${isMenuOpen ? styles.open : ''}`} 
					onClick={() => setIsMenuOpen(false)}
				/>
				
				<nav className={`${styles.Nav} ${isMenuOpen ? styles.open : ''}`}>
					{width <= 768 && (
					<div className={styles.menuHeader}>
						<span>Меню</span>
						<button 
							className={styles.closeButton}
							onClick={() => setIsMenuOpen(false)}
						>
							<HiOutlineX />
						</button>
					</div>
					)}
					<NavLink
						to="/lots"
						className={({ isActive }) =>
							isActive ? `${styles.NavLink} ${styles.active}` : styles.NavLink
						}
						onClick={() => setIsMenuOpen(false)}
					>
						<HiOutlineShoppingBag className={styles.navIcon} />
						Товары
					</NavLink>
					<NavLink
						to="/cart"
						className={({ isActive }) =>
							isActive ? `${styles.NavLink} ${styles.active}` : styles.NavLink
						}
						onClick={() => setIsMenuOpen(false)}
					>
						<HiOutlineShoppingCart className={styles.navIcon} />
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
							onClick={() => setIsMenuOpen(false)}
						>
							<HiOutlineLogin className={styles.navIcon} />
							Войти
						</NavLink>
					) : (
						<NavLink
							to="/personal"
							className={({ isActive }) =>
								isActive ? `${styles.NavLink} ${styles.active}` : styles.NavLink
							}
							onClick={() => setIsMenuOpen(false)}
						>
							<HiOutlineUser className={styles.navIcon} />
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
							onClick={() => setIsMenuOpen(false)}
						>
							<HiOutlineCog className={styles.navIcon} />
							Админ-панель
						</NavLink>
					)}
				</nav>
			</div>
		</header>
	)
})
