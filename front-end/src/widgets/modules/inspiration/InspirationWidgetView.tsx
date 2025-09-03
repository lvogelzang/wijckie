import { useEffect, useMemo, useState } from "react"
import { useInspirationItemsCreate, useInspirationItemsList } from "../../../api/endpoints/api"
import type { InspirationItem, InspirationWidget } from "../../../api/models/api"
import useDateTimeHelper from "../../../helpers/useDateTimeHelper"
import styles from "./InspirationWidgetView.module.scss"
import InspirationView from "./components/InspirationView"

interface Props {
    widget: InspirationWidget
}

const InspirationWidgetView = ({ widget }: Props) => {
    const dateTimeHelper = useDateTimeHelper()
    const create = useInspirationItemsCreate()

    const [item, setItem] = useState<InspirationItem>()

    const date = useMemo(() => dateTimeHelper.today(), [dateTimeHelper])

    const { data: items } = useInspirationItemsList({ module: widget.module, date: dateTimeHelper.dateTimeToIsoDate(date) })

    useEffect(() => {
        if (items) {
            if (items.results.length === 0) {
                create.mutate(
                    {
                        data: {
                            module: widget.module,
                            date: dateTimeHelper.dateTimeToIsoDate(date),
                        },
                    },
                    { onSuccess: (createdItem) => setItem(createdItem) }
                )
            } else {
                setItem(items.results.at(0))
            }
        }
    }, [items])

    return (
        <div className={styles.card}>
            {widget.name}
            {item ? <InspirationView item={item} /> : null}
        </div>
    )
}

export default InspirationWidgetView
