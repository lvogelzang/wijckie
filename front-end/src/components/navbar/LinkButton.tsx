import { useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import { NavigationMenuLink } from "../ui/navigation-menu"

interface Props {
    label: string
    to: string
}

// TODO: Show if active.
const LinkButton = ({ label, to }: Props) => {
    const location = useLocation()

    const active = useMemo(() => {
        return location.pathname.startsWith(to)
    }, [location, to])

    return (
        <NavigationMenuLink asChild>
            <Link to={to}>
                <span className="text-nowrap">{label}</span>
            </Link>
        </NavigationMenuLink>
    )
}

export default LinkButton
