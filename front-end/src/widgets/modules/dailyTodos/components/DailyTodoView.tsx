import { Button } from "@/components/ui/button"
import type { DateTime } from "luxon"
import { useCallback, useState } from "react"
import { useDailyTodoItemsCreate, useDailyTodoItemsPartialUpdate } from "../../../../api/endpoints/api"
import type { DailyTodoItem, DailyTodoOption, StatusEnum } from "../../../../api/models/api"
import useDateTimeHelper from "../../../../helpers/useDateTimeHelper"

interface Props {
    option: DailyTodoOption
    date: DateTime
    initialItem: DailyTodoItem | undefined
}

const DailyTodoView = ({ option, date, initialItem }: Props) => {
    const dateTimeHelper = useDateTimeHelper()

    const [item, setItem] = useState(initialItem)

    const create = useDailyTodoItemsCreate()
    const update = useDailyTodoItemsPartialUpdate()

    const onSuccess = useCallback((data: DailyTodoItem) => setItem(data), [setItem])

    const updateStatus = useCallback(
        (status: StatusEnum) => {
            if (!item) {
                create.mutate(
                    {
                        data: {
                            module: option.module,
                            date: dateTimeHelper.dateTimeToIsoDate(date),
                            option: option.id,
                            status,
                        },
                    },
                    {
                        onSuccess,
                    }
                )
            } else {
                update.mutate(
                    {
                        id: item.id,
                        data: {
                            status,
                        },
                    },
                    {
                        onSuccess,
                    }
                )
            }
        },
        [item, create, update]
    )

    const setStatusTodo = useCallback(() => updateStatus("todo"), [updateStatus])
    const setStatusSkip = useCallback(() => updateStatus("skip"), [updateStatus])
    const setStatusDone = useCallback(() => updateStatus("done"), [updateStatus])

    return (
        <div data-cy="dailyTodoItem">
            {option.name}
            <div>
                <Button onClick={setStatusTodo}>Todo</Button>
                <Button onClick={setStatusSkip}>Skip</Button>
                <Button onClick={setStatusDone}>Done</Button>
            </div>
        </div>
    )
}

export default DailyTodoView
