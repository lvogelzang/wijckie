import type { ButtonVariant } from "react-bootstrap/esm/types"

export interface TableButtonDef {
    label: string
    href?: string
    target?: string
    link?: string
    onClick?: () => void
    variant?: ButtonVariant
}
