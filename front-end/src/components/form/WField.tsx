import { Field } from "@headlessui/react"
import type { ReactNode } from "react"

interface Props {
    hidden?: boolean
    children: ReactNode
}

const WField = ({ hidden, children }: Props) => {
    return <Field hidden={hidden}>{children}</Field>
}
export default WField
