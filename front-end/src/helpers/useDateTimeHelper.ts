import { DateTime } from "luxon"

const useDateTimeHelper = () => {
    const dateTimeToIsoDate = (dateTime: DateTime<true>) => {
        // TODO: Convert to user's time zone.
        return dateTime.toISODate()
    }

    const now = () => {
        return DateTime.now().toUTC()
    }

    const today = () => {
        return now().startOf("day")
    }

    return {
        dateTimeToIsoDate,
        now,
        today,
    }
}

export default useDateTimeHelper
