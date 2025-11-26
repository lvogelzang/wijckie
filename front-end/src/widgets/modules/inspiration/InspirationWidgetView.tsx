import { useInspirationItemsCreate, useInspirationItemsList } from "@/api/endpoints/api"
import type { InspirationItem, InspirationWidget } from "@/api/models/api"
import useDateTimeHelper from "@/helpers/useDateTimeHelper"
import InspirationView from "@/widgets/modules/inspiration/components/InspirationView"
import { useEffect, useMemo, useState } from "react"

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
        <div className="h-40 bg-blue-50 break-inside-avoid" data-cy="inspirationWidget">
            {widget.name}
            {item ? <InspirationView item={item} /> : null}
        </div>
    )
}

export default InspirationWidgetView
