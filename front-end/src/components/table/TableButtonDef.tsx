import type { ButtonVariant } from "../button/WButton"

export interface TableButtonDef {
    label: string
    href?: string
    target?: string
    link?: string
    onClick?: () => void
    variant?: ButtonVariant
}
