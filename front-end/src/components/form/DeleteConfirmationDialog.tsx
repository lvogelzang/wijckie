import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import WButton from "../button/WButton"

interface Props {
    open: boolean
    name: string
    onDelete: () => Promise<unknown>
    onDeleted: () => void
    onClose: () => void
}

const DeleteConfirmationDialog = ({ open, name, onDelete, onDeleted, onClose }: Props) => {
    const { t } = useTranslation()
    const [error, setError] = useState<string>()

    const onFailure = useCallback(() => setError(t("Main.something_went_wrong")), [setError, t])

    const onConfirm = useCallback(() => {
        onDelete().then(onDeleted).catch(onFailure)
    }, [onDelete, onDeleted, onFailure])

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                    <DialogTitle className="font-bold">{t("Main.deletion_confirmation_title", { object: name })}</DialogTitle>
                    <Description>{t("Main.deletion_confirmation", { object: name })}</Description>
                    <div className="mt-4">
                        <WButton type="button" onClick={onConfirm}>
                            {t("Main.delete")}
                        </WButton>
                        <div hidden={!error}>{error}</div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export default DeleteConfirmationDialog
