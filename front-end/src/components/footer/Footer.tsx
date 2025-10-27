import { useAuth } from "@/auth/useAuth"
import { cn } from "@/lib/utils"

const Footer = () => {
    const { isAuthenticated } = useAuth()

    return (
        <footer className={cn("flex items-center justify-center h-[60px] z-10", isAuthenticated && "bg-(--color-footer-background)")}>
            <span className="text-sm">&copy; Studio Goes</span>
        </footer>
    )
}

export default Footer
