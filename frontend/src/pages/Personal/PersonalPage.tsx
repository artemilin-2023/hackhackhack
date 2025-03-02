import { useStore } from "shared/store/store"
import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react"
import { INewLot } from "features/Lots/Lots.model"
import { Button } from "shared/ui/button"
import { HiOutlineLogout, HiSearch } from "react-icons/hi"
import styles from "./PersonalPage.module.css"

export const PersonalPage = observer(() => {
	const store = useStore()
	const [purchaseHistory, setPurchaseHistory] = useState<INewLot[]>([])
	const [searchQuery, setSearchQuery] = useState("")
	const [filteredHistory, setFilteredHistory] = useState<INewLot[]>([])
	
	useEffect(() => {
		setPurchaseHistory([
			{
				id: 1,
				lot_expiration_date: "2023-12-31",
				ksss_nb_code: 12345,
				ksss_fuel_code: 54321,
				initial_weight: 100,
				available_weight: 0,
				status: "Продан",
				total_price: 750000,
				price_per_ton: 7500,
				oil_type: "АИ-95",
				oil_pump: {
					id: 1,
					name: "Нефтебаза №1",
					region: "Московская область"
				}
			},
			{
				id: 2,
				lot_expiration_date: "2023-11-15",
				ksss_nb_code: 23456,
				ksss_fuel_code: 65432,
				initial_weight: 50,
				available_weight: 0,
				status: "Продан",
				total_price: 325000,
				price_per_ton: 6500,
				oil_type: "АИ-92",
				oil_pump: {
					id: 2,
					name: "Нефтебаза №2",
					region: "Ленинградская область"
				}
			},
			{
				id: 3,
				lot_expiration_date: "2023-10-20",
				ksss_nb_code: 34567,
				ksss_fuel_code: 76543,
				initial_weight: 75,
				available_weight: 0,
				status: "Продан",
				total_price: 600000,
				price_per_ton: 8000,
				oil_type: "ДТ",
				oil_pump: {
					id: 3,
					name: "Нефтебаза №3",
					region: "Краснодарский край"
				}
			}
		])
	}, [])
	
	useEffect(() => {
		let filtered = [...purchaseHistory]
		
		// Фильтрация по поисковому запросу
		if (searchQuery) {
			filtered = filtered.filter(purchase => 
				purchase.oil_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
				purchase.oil_pump?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				purchase.oil_pump?.region.toLowerCase().includes(searchQuery.toLowerCase())
			)
		}
		
		setFilteredHistory(filtered)
	}, [purchaseHistory, searchQuery])

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
				
				{filteredHistory.length === 0 ? (
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
