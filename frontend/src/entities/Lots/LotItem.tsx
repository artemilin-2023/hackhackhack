import { INewLot } from "features/Lots/Lots.model"
import styles from "./LotItem.module.css"

export const LotItem = ({ lot }: { lot: INewLot }) => {
	const statusColors = {
		"Подтвержден": styles.statusConfirmed,
		"Продан": styles.statusSold,
		"Неактивен": styles.statusInactive
	}

	return (
		<div className={styles.Lot}>
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
				<div className={styles.type}>
					<h3>Тип топлива</h3>
					<p>{lot.oil_type}</p>
				</div>
				
				{lot.oil_pump && (
					<div className={styles.type}>
						<h3>Нефтебаза</h3>
						<div className={styles.pumpInfo}>
							<p>{lot.oil_pump.name}</p>
							<span>{lot.oil_pump.region}</span>
						</div>
					</div>
				)}
				
				<div className={styles.weight}>
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
						<p>{lot.price_per_ton} ₽</p>
					</div>
					<div>
						<h4>Общая стоимость</h4>
						<p>{lot.total_price} ₽</p>
					</div>
				</div>
				<div className={styles.expiration}>
					<span>До {new Date(lot.lot_expiration_date).toLocaleDateString()}</span>
				</div>
			</div>
		</div>
	)
}
