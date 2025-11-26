import { Button } from "@/components/ui/button"
import { useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"

interface Props {
    id: string
    label: string
    link?: string
    onClick?: () => void
    variant?: "default" | "secondary" | "link" | "destructive"
}

const TableButton = ({ id, label, link, onClick, variant }: Props) => {
    const navigate = useNavigate()

    const handleClick = useCallback(() => {
        if (link) {
            navigate(link)
        } else if (onClick) {
            onClick()
        }
    }, [link, navigate, onClick])

    const defaultedVariant = useMemo(() => {
        if (variant) {
            return variant
        } else if (link) {
            return "secondary"
        }
        return "default"
    }, [variant, link])

    return (
        <Button type="button" onClick={handleClick} variant={defaultedVariant} disabled={!link && !onClick} data-cy={`${id}Button`}>
            {label}
        </Button>
    )
}

export default TableButton
