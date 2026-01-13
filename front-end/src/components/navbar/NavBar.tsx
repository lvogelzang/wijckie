import { useAuth } from "@/auth/useAuth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { makeUrl } from "@/helpers/LinkTreeHelper"
import useLinkTree from "@/hooks/UseLinkTree"
import { cn } from "@/lib/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRocketLaunch } from "@fortawesome/sharp-solid-svg-icons"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

// TODO: Translations.
// TODO: Consequent styling of buttons.
// TODO: Close sidebar when clicking item.
// TODO: Sidebar: add app icon.
// TODO: Show dynamically loaded modules.
// TODO: Language icon instead of text?
// TODO: User avatar?
const NavBar = () => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const { user, isAuthenticated } = useAuth()
    const { isMobile } = useSidebar()

    return (
        <header className={cn("fixed top-0 flex h-20 w-full shrink-0 items-center px-4 md:px-6 z-[9999]", isAuthenticated && "backdrop-blur-sm bg-(--color-navbar-background)")}>
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <a href="#">
                                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                        <FontAwesomeIcon icon={faRocketLaunch} />
                                    </div>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-medium">Wijckie</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to={makeUrl(l.DASHBOARD, [])} className="font-medium">
                                        Dashboard
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to={makeUrl(l.DASHBOARD, [])} className="font-medium">
                                        Modules
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild isActive={true}>
                                            <Link to="#">Module 1</Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <Link to="#">Module 2</Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <Link to="#">Module 3</Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link to={makeUrl(l.MODULES, [])} className="font-medium">
                                    {t("NavBar.settings")}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                        {/* <Avatar className="h-8 w-8 rounded-lg grayscale">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                        </Avatar> */}
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{user?.username}</span>
                                            <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
                                        </div>
                                        {/* <IconDotsVertical className="ml-auto size-4" /> */}
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            {/* <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                            </Avatar> */}
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">{user?.username}</span>
                                                <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Link to={makeUrl(l.MY_ACCOUNT, [])}>Account</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>Notifications</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Log out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <div className="flex lg:hidden">
                <SidebarTrigger />
            </div>
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
