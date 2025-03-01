import { CreateLotForm } from "widgets/Admin/CreateLotForm"
import { UploadCSV } from "widgets/Admin/UploadCSV"
import styles from "./AdminPage.module.css"
import { Grid } from "shared/ui/grid"
import { LotItem } from "entities/Lots/LotItem"
import { useStore } from "shared/store/store"
import { observer } from "mobx-react-lite"

export const AdminPage = observer(() => {

	const store = useStore()

	return (
		<div>
			<UploadCSV />
			<div className={styles.Child}>
				<h1>Все лоты</h1>
				<Grid>
					{store.lots.map((lot) => (
						<LotItem
							lot={lot}
						/>
					))}
				</Grid>
			</div>
		</div>
	)
})
