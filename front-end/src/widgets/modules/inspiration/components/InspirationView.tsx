import { useInspirationOptionsRetrieve } from "../../../../api/endpoints/api"
import type { InspirationItem } from "../../../../api/models/api"

interface Props {
    item: InspirationItem
}

const InspirationView = ({ item }: Props) => {
    const { data: inspirationOption } = useInspirationOptionsRetrieve(item.option)

    return (
        <div data-cy="inspirationItem">
            {inspirationOption?.type === "image" ? <img src={inspirationOption.imageURL} className="max-w-full max-h-40" /> : null}
            {inspirationOption?.type === "text" ? <span>{inspirationOption.text}</span> : null}
        </div>
    )
}

export default InspirationView
