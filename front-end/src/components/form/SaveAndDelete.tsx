import { useCallback, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import DeleteConfirmationModal from "./DeleteConfirmationModal"

interface Props {
    mode: "Create" | "Update"
    name: string
    onDelete?: () => Promise<unknown>
    onDeleted?: () => void
}

const SaveAndDelete = ({ mode, name, onDelete, onDeleted }: Props) => {
    const { t } = useTranslation()
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)

    const onClickDelete = useCallback(() => {
        setShowConfirmationModal(true)
    }, [setShowConfirmationModal])

    const onCloseConfirmationModal = useCallback(() => {
        setShowConfirmationModal(false)
    }, [setShowConfirmationModal])

    return (
        <Form.Group>
            <Button type="submit">{t("Main.save")}</Button>
            {mode === "Update" ? (
                <Button type="button" variant="danger" disabled={!onDelete} onClick={onClickDelete}>
                    {t("Main.delete")}
                </Button>
            ) : null}
            {onDelete && onDeleted ? <DeleteConfirmationModal show={showConfirmationModal} name={name} onDelete={onDelete} onDeleted={onDeleted} onClose={onCloseConfirmationModal} /> : null}
        </Form.Group>
    )
}

export default SaveAndDelete
