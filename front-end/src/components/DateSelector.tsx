import type { DateTime } from "luxon"
import { useCallback, type Dispatch, type SetStateAction } from "react"
import { Button } from "react-bootstrap"
import useDateTimeHelper from "../helpers/useDateTimeHelper"

interface Props {
    date: DateTime
    setDate: Dispatch<SetStateAction<DateTime<true>>>
}

const DateSelector = ({ date, setDate }: Props) => {
    const dateTimeHelper = useDateTimeHelper()

    const previousDay = useCallback(() => {
        setDate((date) => date.minus({ days: 1 }))
    }, [setDate])

    const nextDay = useCallback(() => {
        setDate((date) => date.plus({ days: 1 }))
    }, [setDate])

    return (
        <div>
            {dateTimeHelper.dateTimeToIsoDate(date)}
            <Button onClick={previousDay}>&lt;</Button>
            <Button onClick={nextDay}>&gt;</Button>
        </div>
    )
}

export default DateSelector
