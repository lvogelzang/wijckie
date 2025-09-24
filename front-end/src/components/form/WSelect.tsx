import { Select } from "@headlessui/react"
import type { ReactNode } from "react"

interface Props {
    name: string
    label: string
    invalid: boolean
    disabled?: boolean
    children: ReactNode
}

const WSelect = ({ name, label, invalid, disabled, children }: Props) => {
    return (
        <Select name={name} aria-label={label} disabled={disabled}>
            {children}
        </Select>
    )
}

export default WSelect
