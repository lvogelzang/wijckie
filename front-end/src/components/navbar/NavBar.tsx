import { useAuth } from "@/auth/useAuth"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { makeUrl } from "@/helpers/LinkTreeHelper"
import useLinkTree from "@/hooks/UseLinkTree"
import { cn } from "@/lib/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/sharp-solid-svg-icons"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

interface Props {
    toggleSidebar: () => void
}

// TODO: Translations.
// TODO: Consequent styling of buttons.
// TODO: Close sidebar when clicking item.
// TODO: Sidebar: add app icon.
// TODO: Show dynamically loaded modules.
// TODO: User avatar?
const NavBar = ({ toggleSidebar }: Props) => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const { user, isAuthenticated } = useAuth()

    return (
        <header className={cn("flex h-20 w-full shrink-0 items-center px-4 md:px-6", isAuthenticated && "backdrop-blur-sm bg-(--color-navbar-background)")}>
            {isAuthenticated ? (
                <div className="flex lg:hidden">
                    <Button onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} />
                    </Button>
                </div>
            ) : null}
            <div className="mr-6 hidden lg:flex" hidden={!user}>
                <Link to={makeUrl(l.DASHBOARD, [])}>
                    <span className="text-lg font-semibold">Wijckie</span>
                </Link>
            </div>
            <NavigationMenu className="hidden lg:flex" viewport={false}>
                <NavigationMenuList>
                    <NavigationMenuLink asChild hidden={!user}>
                        <Link to={makeUrl(l.DASHBOARD, [])} className="text-nowrap" data-cy="dashboardButton">
                            {t("NavBar.dashboard")}
                        </Link>
                    </NavigationMenuLink>
                    <NavigationMenuItem hidden={!user}>
                        <NavigationMenuTrigger>Modules</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-4">
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link to="#">Module 1</Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to="#">Module 2</Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to="#">Module 3</Link>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu className="ml-auto hidden lg:flex" viewport={false}>
                <NavigationMenuList>
                    <NavigationMenuItem hidden={!user}>
                        <Link to={makeUrl(l.MODULES, [])} className={navigationMenuTriggerStyle()}>
                            {t("NavBar.settings")}
                        </Link>
                    </NavigationMenuItem>
                    {user ? (
                        <NavigationMenuItem>
                            <NavigationMenuTrigger data-cy="menuUsername">{user.username}</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="grid p-2">
                                    <NavigationMenuLink asChild>
                                        <Link to={makeUrl(l.MY_ACCOUNT, [])} className="text-nowrap" data-cy="myAccountButton">
                                            {t("MyAccount.title")}
                                        </Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to={makeUrl(l.LOGOUT, [])} className="text-nowrap" data-cy="logoutButton">
                                            {t("NavBar.logout")}
                                        </Link>
                                    </NavigationMenuLink>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ) : null}
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    )
}

export default NavBar
