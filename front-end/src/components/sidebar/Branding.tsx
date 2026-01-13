const Branding = () => {
    return (
        <div className="relative flex gap-x-1 h-12 shrink-0 items-center">
            <img src={`/${import.meta.env.VITE_APPLICATION_SYSTEM_NAME}/logo.svg`} alt="logo" className="h-8 w-auto" />
            <span className="font-medium">Wijckie</span>
        </div>
    )
}

export default Branding
