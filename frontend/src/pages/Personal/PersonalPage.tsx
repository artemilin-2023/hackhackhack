import { useStore } from "shared/store/store"
import { observer } from "mobx-react-lite"
import styles from "./PersonalPage.module.css"

export const PersonalPage = observer(() => {
	const store = useStore()
	
	return(
		<div className={styles.Page}>
			{JSON.stringify(store.user)}	
		</div>
	)
})
