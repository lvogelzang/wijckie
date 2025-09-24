import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import WButton from "../button/WButton"
import DeleteConfirmationDialog from "./DeleteConfirmationDialog"

interface Props {
    mode: "Create" | "Update"
    name: string
    onDelete?: () => Promise<unknown>
    onDeleted?: () => void
}

const SaveAndDelete = ({ mode, name, onDelete, onDeleted }: Props) => {
    const { t } = useTranslation()
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)

    const onClickDelete = useCallback(() => {
        setShowConfirmationDialog(true)
    }, [setShowConfirmationDialog])

    const onCloseConfirmationDialog = useCallback(() => {
        setShowConfirmationDialog(false)
    }, [setShowConfirmationDialog])

    return (
        <div>
            <WButton type="submit">{t("Main.save")}</WButton>
            {mode === "Update" ? (
                <WButton type="button" disabled={!onDelete} onClick={onClickDelete}>
                    {t("Main.delete")}
                </WButton>
            ) : null}
            {onDelete && onDeleted ? <DeleteConfirmationDialog open={showConfirmationDialog} name={name} onDelete={onDelete} onDeleted={onDeleted} onClose={onCloseConfirmationDialog} /> : null}
        </div>
    )
}

export default SaveAndDelete
