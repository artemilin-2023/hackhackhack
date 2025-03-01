import { useStore } from "shared/store/store"
import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react"
import { INewLot } from "features/Lots/Lots.model"
import styles from "./PersonalPage.module.css"

export const PersonalPage = observer(() => {
	const store = useStore()
	const [purchaseHistory, setPurchaseHistory] = useState<INewLot[]>([])
	
	useEffect(() => {
		// Мокнутые данные истории покупок
		// В реальном приложении здесь был бы запрос к API
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

	if (!store.user) {
		return (
			<div className={styles.notAuthorized}>
				<h2>Вы не авторизованы</h2>
				<p>Пожалуйста, войдите в систему для доступа к личному кабинету</p>
			</div>
		)
	}
	
	return(
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Личный кабинет</h1>
				<button 
					className={styles.logoutButton}
					onClick={() => store.logout()}
				>
					Выйти
				</button>
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
				<h2 className={styles.sectionTitle}>История покупок</h2>
				
				{purchaseHistory.length === 0 ? (
					<div className={styles.emptyHistory}>
						<p>У вас пока нет покупок</p>
					</div>
				) : (
					<div className={styles.purchaseHistory}>
						{purchaseHistory.map((purchase) => (
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
										<span className={styles.detailValue}>{purchase.price_per_ton} ₽</span>
									</div>
									<div className={styles.detailItem}>
										<span className={styles.detailLabel}>Общая стоимость:</span>
										<span className={styles.detailValue}>{purchase.total_price} ₽</span>
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
