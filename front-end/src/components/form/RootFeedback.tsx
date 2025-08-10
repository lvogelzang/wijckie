import type { FC } from "react"
import type { FieldErrors } from "react-hook-form"
import Feedback from "./Feedback"

interface Props {
    errors: FieldErrors<any>
}

const RootFeedback: FC<Props> = ({ errors }) => {
    return <Feedback error={errors.root?.message} />
}

export default RootFeedback
