import { ReactNode } from "react"
import styles from "./grid.module.css"

interface GridProps {
	children: ReactNode;
	columns?: {
		sm?: number;
		md?: number;
		lg?: number;
	};
	gap?: string;
	className?: string;
}

export const Grid = ({ 
	children, 
	columns = { sm: 1, md: 2, lg: 3 },
	gap,
	className = ""
}: GridProps) => {
	return (
		<div 
			className={`${styles.grid} ${className}`}
			style={{ 
				'--grid-cols-sm': columns.sm || 1,
				'--grid-cols-md': columns.md || 2,
				'--grid-cols-lg': columns.lg || 3,
				'--grid-gap': gap || '1rem'
			} as React.CSSProperties}
		>
			{children}
		</div>
	)
}
