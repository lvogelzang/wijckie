import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"

interface Props {
    error: string | null
    setError: (error: string | null) => void
}

const ErrorDialog = ({ error, setError }: Props) => {
    const { t } = useTranslation()

    const onClose = useCallback(() => setError(null), [setError])

    return (
        <Dialog open={!!error} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                    <DialogTitle className="font-bold">{t("ErrorDialog.title")}</DialogTitle>
                    <Description>{error}</Description>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export default ErrorDialog
