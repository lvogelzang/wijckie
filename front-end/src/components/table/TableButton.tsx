import { useCallback, type FC } from "react"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

interface Props {
    label: string
    href?: string
    target?: string
    link?: string
    onClick?: () => void
    variant?: string
}

const TableButton: FC<Props> = ({ label, href, target, link, onClick, variant }) => {
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
