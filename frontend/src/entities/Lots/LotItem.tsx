import { ILot } from "features/Lots/Lots.model"
import styles from "./LotItem.module.css"

export const LotItem = ({ lot }: { lot: ILot }) => {

	return (
		<div className={styles.Lot}>
			<h3>{lot.title}</h3>
			<p>{lot.description}</p>
			<p>{lot.price}</p>
		</div>
	)
}
