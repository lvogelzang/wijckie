import type { DateTime } from "luxon"
import { useCallback, type Dispatch, type SetStateAction } from "react"
import useDateTimeHelper from "../helpers/useDateTimeHelper"
import WButton from "./button/WButton"

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
            <WButton onClick={previousDay}>&lt;</WButton>
            <WButton onClick={nextDay}>&gt;</WButton>
        </div>
    )
}

export default DateSelector
