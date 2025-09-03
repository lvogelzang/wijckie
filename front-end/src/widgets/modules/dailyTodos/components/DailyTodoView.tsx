import type { DateTime } from "luxon"
import { useCallback, useState } from "react"
import { Button, ButtonGroup } from "react-bootstrap"
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
        <div>
            {option.name}
            <ButtonGroup>
                <Button active={item?.status === "todo"} onClick={setStatusTodo}>
                    Todo
                </Button>
                <Button active={item?.status === "skip"} onClick={setStatusSkip}>
                    Skip
                </Button>
                <Button active={item?.status === "done"} onClick={setStatusDone}>
                    Done
                </Button>
            </ButtonGroup>
        </div>
    )
}

export default DailyTodoView
