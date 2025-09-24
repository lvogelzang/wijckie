import type { DateTime } from "luxon"
import { useCallback, useState } from "react"
import { useDailyTodoItemsCreate, useDailyTodoItemsPartialUpdate } from "../../../../api/endpoints/api"
import type { DailyTodoItem, DailyTodoOption, StatusEnum } from "../../../../api/models/api"
import WButton from "../../../../components/button/WButton"
import WButtonGroup from "../../../../components/button/WButtonGroup"
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
        <div>
            {option.name}
            <WButtonGroup>
                <WButton variant={item?.status === "todo" ? "segment-selected" : "segment"} onClick={setStatusTodo}>
                    Todo
                </WButton>
                <WButton variant={item?.status === "skip" ? "segment-selected" : "segment"} onClick={setStatusSkip}>
                    Skip
                </WButton>
                <WButton variant={item?.status === "done" ? "segment-selected" : "segment"} onClick={setStatusDone}>
                    Done
                </WButton>
            </WButtonGroup>
        </div>
    )
}

export default DailyTodoView
