import { ReactNode } from "react"
import styles from "./LotsGrid.module.css"

interface ILotsGridProps {
	children: ReactNode
}

export const LotsGrid = ({ children }: ILotsGridProps) => {

	return (
		<div className={styles.Grid}>
			{children}
		</div>
	)
}
