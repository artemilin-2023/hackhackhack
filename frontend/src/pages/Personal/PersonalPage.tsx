import { useStore } from "shared/store/store"
import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react"
import { INewLot } from "features/Lots/Lots.model"
import { Button } from "shared/ui/button"
import { HiOutlineLogout, HiSearch } from "react-icons/hi"
import styles from "./PersonalPage.module.css"

export const PersonalPage = observer(() => {
	const store = useStore()
	const [isLoading, setIsLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState("")
	const [filteredHistory, setFilteredHistory] = useState<INewLot[]>([])
	
	useEffect(() => {
		const fetchPurchaseHistory = async () => {
			setIsLoading(true)
			try {
				await store.getOrders()
				setIsLoading(false)
			} catch (error) {
				console.error("Error fetching purchase history:", error)
				setIsLoading(false)
			}
		}
		
		if (store.user) {
			fetchPurchaseHistory()
		}
	}, [store.user])
	
	useEffect(() => {
		let filtered = [...store.orders]
		
		if (searchQuery) {
			filtered = filtered.filter(purchase => 
				purchase.oil_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
				purchase.oil_pump?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				purchase.oil_pump?.region.toLowerCase().includes(searchQuery.toLowerCase())
			)
		}
		
		setFilteredHistory(filtered)
	}, [store.orders, searchQuery])

	if (!store.user) {
		return (
			<div className={styles.notAuthorized}>
				<h2>Вы не авторизованы</h2>
				<p>Пожалуйста, войдите в систему для доступа к личному кабинету</p>
				<Button 
					onClick={() => window.location.href = '/auth'}
					className={styles.authButton}
				>
					Войти в систему
				</Button>
			</div>
		)
	}
	
	return(
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Личный кабинет</h1>
				<Button 
					variant="outline"
					className={styles.logoutButton}
					onClick={() => store.logout()}
				>
					<HiOutlineLogout className={styles.buttonIcon} />
					Выйти
				</Button>
			</div>
			
			<div className={styles.userInfoCard}>
				<div className={styles.userAvatar}>
					{store.user.name.charAt(0).toUpperCase()}
				</div>
				<div className={styles.userDetails}>
					<h2>{store.user.name}</h2>
					<p className={styles.userEmail}>{store.user.email}</p>
					<div className={styles.userRole}>
						<span className={styles.roleTag}>
							{store.user.role === "admin" ? "Администратор" : "Покупатель"}
						</span>
					</div>
				</div>
			</div>
			
			<div className={styles.section}>
				<div className={styles.sectionHeader}>
					<h2 className={styles.sectionTitle}>История покупок</h2>
					<div className={styles.filterControls}>
						<div className={styles.searchInputWrapper}>
							<HiSearch className={styles.searchIcon} />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Поиск по истории"
								className={styles.searchInput}
							/>
						</div>
					</div>
				</div>
				
				{isLoading ? (
					<div className={styles.emptyHistory}>
						<div className={styles.emptyIcon}>⏳</div>
						<h3>Загрузка данных...</h3>
						<p>Пожалуйста, подождите</p>
					</div>
				) : filteredHistory.length === 0 ? (
					<div className={styles.emptyHistory}>
						<div className={styles.emptyIcon}>🛒</div>
						<h3>У вас пока нет покупок</h3>
						<p>Здесь будет отображаться история ваших покупок</p>
						<Button 
							onClick={() => window.location.href = '/lots'}
							className={styles.browseButton}
						>
							Перейти в каталог
						</Button>
					</div>
				) : (
					<div className={styles.purchaseHistory}>
						{filteredHistory.map((purchase) => (
							<div key={purchase.id} className={styles.purchaseCard}>
								<div className={styles.purchaseHeader}>
									<div className={styles.purchaseType}>
										<h3>{purchase.oil_type}</h3>
										{purchase.oil_pump && (
											<span className={styles.pumpInfo}>
												{purchase.oil_pump.name}, {purchase.oil_pump.region}
											</span>
										)}
									</div>
									<span className={`${styles.purchaseStatus} ${styles.statusSold}`}>
										{purchase.status}
									</span>
								</div>
								
								<div className={styles.purchaseDetails}>
									<div className={styles.detailItem}>
										<span className={styles.detailLabel}>Дата покупки:</span>
										<span className={styles.detailValue}>
											{new Date(purchase.lot_expiration_date).toLocaleDateString()}
										</span>
									</div>
									<div className={styles.detailItem}>
										<span className={styles.detailLabel}>Вес:</span>
										<span className={styles.detailValue}>{purchase.initial_weight} т</span>
									</div>
									<div className={styles.detailItem}>
										<span className={styles.detailLabel}>Цена за тонну:</span>
										<span className={styles.detailValue}>{purchase.price_per_ton.toLocaleString()} ₽</span>
									</div>
									<div className={styles.detailItem}>
										<span className={styles.detailLabel}>Общая стоимость:</span>
										<span className={styles.detailValue}>{purchase.total_price.toLocaleString()} ₽</span>
									</div>
								</div>
								
								<div className={styles.purchaseCodes}>
									<span>КССС НБ: {purchase.ksss_nb_code}</span>
									<span>КССС Топливо: {purchase.ksss_fuel_code}</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
})
