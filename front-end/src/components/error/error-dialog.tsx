import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"

interface Props {
    error: string | undefined
    setError: (error: string | undefined) => void
}

// TODO: Add content, remove error on close.
const ErrorDialog = ({ error, setError }: Props) => {
    const { t } = useTranslation()
    const onCancel = useCallback(() => setError(undefined), [setError])

    return (
        <AlertDialog open={!!error}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("ErrorDialog.title")}</AlertDialogTitle>
                    <AlertDialogDescription data-cy="errorDescription">{error}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel} data-cy="cancelButton">
                        {t("ErrorDialog.ok")}
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ErrorDialog
