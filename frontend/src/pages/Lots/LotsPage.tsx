import { useStore } from "shared/store/store"
import { observer } from "mobx-react-lite"
import { Grid } from "shared/ui/grid"
import { LotItem } from "entities/Lots/LotItem"

export const LotsPage = observer(() => {

	const store = useStore()

	return (
		<div style={{marginTop: "16px"}}>
			{store.lots &&
				<Grid>
					{store.lots?.map((lot) => (
						<LotItem
							lot={lot}
						/>
					))}
				</Grid>
			}
		</div>
	)
})
