import { useMemo, type FC } from "react"
import { Link, useLocation } from "react-router-dom"

interface Props {
    name: string
    href?: string
    to?: string
}

const NavBarItem: FC<Props> = ({ name, href, to }) => {
    const location = useLocation()

    const isActive = useMemo(() => {
        return (href && location.pathname.startsWith(href)) || (to && location.pathname.startsWith(to))
    }, [href, location, to])

    const cls = useMemo(() => {
        return isActive ? "nav-link active" : "nav-link"
    }, [isActive])

    return (
        <li className="nav-item">
            {href ? (
                <a className={cls} href={href}>
                    {name}
                </a>
            ) : (
                <Link className={cls} to={to!}>
                    {name}
                </Link>
            )}
        </li>
    )
}

export default NavBarItem
