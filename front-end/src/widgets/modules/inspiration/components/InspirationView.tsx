import { useInspirationOptionsRetrieve } from "../../../../api/endpoints/api"
import type { InspirationItem } from "../../../../api/models/api"
import styles from "./InspirationView.module.scss"

interface Props {
    item: InspirationItem
}

const InspirationView = ({ item }: Props) => {
    const { data: inspirationOption } = useInspirationOptionsRetrieve(item.option)

    return (
        <div>
            {inspirationOption?.type === "image" ? <img src={inspirationOption.imageURL} className={styles.image} /> : null}
            {inspirationOption?.type === "text" ? <span>{inspirationOption.text}</span> : null}
        </div>
    )
}

export default InspirationView
