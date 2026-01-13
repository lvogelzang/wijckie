import { useDailyTodoItemsList, useDailyTodoOptionsList } from "@/api/endpoints/api"
import type { DailyTodosWidget } from "@/api/models/api"
import DateSelector from "@/components/DateSelector"
import useDateTimeHelper from "@/helpers/useDateTimeHelper"
import DailyTodoView from "@/widgets/modules/dailyTodos/components/DailyTodoView"
import { useMemo, useState } from "react"

interface Props {
    widget: DailyTodosWidget
}

const DailyTodosWidgetView = ({ widget }: Props) => {
    const dateTimeHelper = useDateTimeHelper()

    const [date, setDate] = useState(dateTimeHelper.today())

    const { data: options, isFetching: isFetchingOptions } = useDailyTodoOptionsList({ module: widget.module })
    const { data: items, isFetching: isFetchingItems } = useDailyTodoItemsList({ module: widget.module, date: dateTimeHelper.dateTimeToIsoDate(date) })

    const data = useMemo(() => {
        if (!options || isFetchingOptions || !items || isFetchingItems) {
            return undefined
        }
        const todos = options.results.map((option) => {
            return {
                option,
                item: items.results.find((item) => item.option === option.id),
            }
        })
        return {
            date,
            todos,
        }
    }, [options, isFetchingOptions, items, isFetchingItems, date])

    return (
        <div className="bg-amber-50 relative break-inside-avoid" data-cy="dailyTodosWidget">
            <DateSelector date={date} setDate={setDate} />
            {widget.name}
            {data?.todos.map((todo) => <DailyTodoView key={`${data.date.toISODate()}_${todo.option.id}`} option={todo.option} date={data.date} initialItem={todo.item} />)}
        </div>
    )
}

export default DailyTodosWidgetView
