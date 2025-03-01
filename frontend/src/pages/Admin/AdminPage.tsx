import { UploadCSV } from "widgets/Admin/UploadCSV"
import styles from "./AdminPage.module.css"
import { Grid } from "shared/ui/grid"
import { LotItem } from "entities/Lots/LotItem"
import { useStore } from "shared/store/store"
import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react"
import { LotsSorting } from "widgets/Lots/LotsSorting"
import { Button } from "shared/ui/button"

export const AdminPage = observer(() => {
	const store = useStore()
	const [currentPage, setCurrentPage] = useState(1)
	const [sortBy, setSortBy] = useState('id')
	const [isDescending, setIsDescending] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedOilType, setSelectedOilType] = useState<string | undefined>(undefined)
	const [selectedPumpName, setSelectedPumpName] = useState<string | undefined>(undefined)
	const PAGE_SIZE = 6

	useEffect(() => {
		store.getLots(
			currentPage, 
			PAGE_SIZE, 
			sortBy, 
			isDescending, 
			searchQuery,
			selectedOilType,
			selectedPumpName
		)
	}, [currentPage, sortBy, isDescending, searchQuery, selectedOilType, selectedPumpName])

	const handleNextPage = () => {
		if (store.pagination.has_next) {
			setCurrentPage(prev => prev + 1)
		}
	}

	const handlePrevPage = () => {
		if (store.pagination.has_prev) {
			setCurrentPage(prev => prev - 1)
		}
	}

	const handleSortChange = (sort: string) => {
		setSortBy(sort)
		setCurrentPage(1)
	}

	const handleDirectionChange = () => {
		setIsDescending(prev => !prev)
		setCurrentPage(1)
	}
	
	const handleSearch = (query: string) => {
		setSearchQuery(query)
		setCurrentPage(1)
	}

	const handleOilTypeChange = (oilType: string | undefined) => {
		setSelectedOilType(oilType)
		setCurrentPage(1)
	}

	const handlePumpNameChange = (pumpName: string | undefined) => {
		setSelectedPumpName(pumpName)
		setCurrentPage(1)
	}

	return (
		<div>
			<UploadCSV />
			<div className={styles.adminContent}>
				<h1 className={styles.title}>Все лоты</h1>
				
				<LotsSorting
					currentSort={sortBy}
					isDescending={isDescending}
					onSortChange={handleSortChange}
					onDirectionChange={handleDirectionChange}
					onSearch={handleSearch}
					selectedOilType={selectedOilType}
					onOilTypeChange={handleOilTypeChange}
					selectedPumpName={selectedPumpName}
					onPumpNameChange={handlePumpNameChange}
					pumpNames={store.pumpNames}
				/>
				
				<Grid>
					{store.lots?.map((lot) => (
						<LotItem
							key={lot.id}
							lot={lot}
						/>
					))}
				</Grid>
				
				{store.lots && store.lots.length > 0 && (
					<div className={styles.pagination}>
						<Button 
							onClick={handlePrevPage}
							disabled={!store.pagination.has_prev}
							variant="outline"
						>
							Назад
						</Button>
						<span>
							Страница {currentPage} из {store.pagination.total_pages}
						</span>
						<Button
							onClick={handleNextPage}
							disabled={!store.pagination.has_next}
							variant="outline"
						>
							Вперед
						</Button>
					</div>
				)}
			</div>
		</div>
	)
})
