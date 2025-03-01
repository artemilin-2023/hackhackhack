import { ReactNode } from "react"
import styles from "./grid.module.css"

interface ILotsGridProps {
	children: ReactNode
}

export const Grid = ({ children }: ILotsGridProps) => {

	return (
		<div className={styles.Grid}>
			{children}
		</div>
	)
}
