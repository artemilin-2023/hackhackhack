import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useStore } from "shared/store/store"
import styles from "./SingleLot.module.css"
import { AddToCartForm } from 'features/Cart/AddToCartForm'

export const SingleLot = () => {
	const { id } = useParams()
	const store = useStore()

	const lot = store.lots?.find((lot) => lot.id === Number(id))

	useEffect(() => {
		if (lot) {
			store.setActiveLot(lot)
		}
	}, [id])

	if (!lot) {
		return <div>Lot not found</div>
	}

	const statusColors = {
		"Подтвержден": styles.statusConfirmed,
		"Продан": styles.statusSold,
		"Неактивен": styles.statusInactive
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.codes}>
					<span>КССС НБ: {lot.ksss_nb_code}</span>
					<span>КССС Топливо: {lot.ksss_fuel_code}</span>
				</div>
				<span className={`${styles.status} ${statusColors[lot.status]}`}>
					{lot.status}
				</span>
			</div>

			<div className={styles.mainInfo}>
				<div className={styles.section}>
					<h3>Тип топлива</h3>
					<p>{lot.oil_type}</p>
				</div>
				
				{lot.oil_pump && (
					<div className={styles.section}>
						<h3>Нефтебаза</h3>
						<div className={styles.pumpInfo}>
							<p>{lot.oil_pump.name}</p>
							<span>{lot.oil_pump.region}</span>
						</div>
					</div>
				)}
				
				<div className={styles.stats}>
					<div>
						<h4>Начальный вес</h4>
						<p>{lot.initial_weight} т</p>
					</div>
					<div>
						<h4>Доступный вес</h4>
						<p>{lot.available_weight} т</p>
					</div>
				</div>
			</div>

			<div className={styles.footer}>
				<div className={styles.price}>
					<div>
						<h4>Цена за тонну</h4>
						<p>{(Math.round(lot.price_per_ton * 10) / 10).toLocaleString()} ₽</p>
					</div>
					<div>
						<h4>Общая стоимость</h4>
						<p>{(Math.round(lot.total_price * 10) / 10).toLocaleString()} ₽</p>
					</div>
				</div>
				<div className={styles.expiration}>
					<span>До {new Date(lot.lot_expiration_date).toLocaleDateString()}</span>
				</div>
			</div>

			<div className={styles.actions}>
				{lot.status === "Подтвержден" && <AddToCartForm lot={lot} />}
			</div>
		</div>
	)
}