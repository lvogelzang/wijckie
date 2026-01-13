import { useAuth } from "@/auth/useAuth"
import Branding from "@/components/sidebar/Branding"
import MenuButton from "@/components/sidebar/MenuButton"
import { makeUrl } from "@/helpers/LinkTreeHelper"
import useLinkTree from "@/hooks/UseLinkTree"
import type MenuItem from "@/types/MenuItem"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome, faXmark } from "@fortawesome/sharp-regular-svg-icons"
import { faGears } from "@fortawesome/sharp-solid-svg-icons"
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react"
import { useMemo, type ComponentProps } from "react"
import { useTranslation } from "react-i18next"

interface Props {
    open: boolean
    toggleOpen: () => void
}

function AppSidebar({ open, toggleOpen, children, ...props }: Props & ComponentProps<"div">) {
    const { isAuthenticated } = useAuth()
    const { t } = useTranslation()
    const l = useLinkTree()

    const menuItems = useMemo(() => {
        const items: MenuItem[] = []
        items.push({
            id: "Dashboard",
            title: t("Main.dashboard"),
            path: makeUrl(l.DASHBOARD, []),
            icon: faHome,
        })
        items.push({
            id: "Modules",
            title: t("Main.modules"),
            path: makeUrl(l.MODULES, []),
            icon: faGears,
        })
        return items
    }, [t, l])

    return (
        <div {...props}>
            <Dialog open={open} onClose={toggleOpen} className="relative z-50 lg:hidden" hidden={!isAuthenticated}>
                <DialogBackdrop transition className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0" />
                <div className="fixed inset-0 flex">
                    <DialogPanel transition className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full">
                        <TransitionChild>
                            <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                <button type="button" onClick={toggleOpen} className="-m-2.5 p-2.5">
                                    <span className="sr-only">{t("Main.close_sidebar")}</span>
                                    <FontAwesomeIcon icon={faXmark} aria-hidden="true" color="background" />
                                </button>
                            </div>
                        </TransitionChild>
                        <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-background px-3 pb-2 dark:bg-gray-900 dark:ring dark:ring-white/10 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-black/10">
                            <Branding />
                            <nav className="relative flex flex-1 flex-col">
                                <ul role="list" className="flex flex-1 flex-col gap-y-2">
                                    {menuItems.map((item) => (
                                        <MenuButton key={item.id} item={item} />
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
            {children}
        </div>
    )
}

export default AppSidebar
