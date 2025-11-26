import { InlineErrorMessage } from "@/components/error/inline-error-message"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

interface Props {
    mode: "Create" | "Update"
    name: string
    onDelete?: () => Promise<unknown>
    onDeleted?: () => void
}

const SaveAndDelete = ({ mode, name, onDelete, onDeleted }: Props) => {
    const { t } = useTranslation()
    const [error, setError] = useState<string>()

    const onFailure = useCallback(() => setError(t("Main.something_went_wrong")), [setError, t])

    const onConfirm = useCallback(() => {
        // TODO: Prevent closing automatically, show error instead of closing dialog when an error occurs.
        if (onDelete) {
            onDelete().then(onDeleted).catch(onFailure)
        }
    }, [onDelete])

    return (
        <div>
            <Button type="submit" data-cy="submitButton">
                {t("Main.save")}
            </Button>
            {mode === "Update" ? (
                <AlertDialog>
                    <AlertDialogTrigger data-cy="deleteButton">{t("Main.delete")}</AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t("Main.deletion_confirmation_title", { object: name })}</AlertDialogTitle>
                            <AlertDialogDescription>{t("Main.deletion_confirmation", { object: name })}</AlertDialogDescription>
                            <InlineErrorMessage>{error}</InlineErrorMessage>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t("Main.cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={onConfirm} data-cy="deleteConfirmationButton">
                                {t("Main.delete")}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            ) : null}
        </div>
    )
}

export default SaveAndDelete
