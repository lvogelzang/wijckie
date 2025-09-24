import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../button/WButton"

interface Props {
    label: string
    href?: string
    target?: string
    link?: string
    onClick?: () => void
    variant?: "primary" | "link" | "danger"
}

const TableButton = ({ label, href, target, link, onClick, variant }: Props) => {
    const navigate = useNavigate()

    const handleClick = useCallback(() => {
        if (link) {
            navigate(link)
        } else if (onClick) {
            onClick()
        }
    }, [link, navigate, onClick])

    return (
        <Button type="button" href={href} target={target} onClick={link || onClick ? handleClick : undefined} variant={variant} disabled={!href && !link && !onClick}>
            {label}
        </Button>
    )
}

export default TableButton
