import { useCallback, useState, type FC } from "react"
import { Button, Modal } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import Feedback from "./Feedback"

interface Props {
    show: boolean
    name: string
    onDelete: () => Promise<unknown>
    onDeleted: () => void
    onClose: () => void
}

const DeleteConfirmationModal: FC<Props> = ({ show, name, onDelete, onDeleted, onClose }) => {
    const { t } = useTranslation()
    const [error, setError] = useState<string>()

    const onFailure = useCallback(() => setError(t("Main.something_went_wrong")), [setError, t])

    const onConfirm = useCallback(() => {
        onDelete().then(onDeleted).catch(onFailure)
    }, [onDelete, onDeleted, onFailure])

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
                {t("Main.deletion_confirmation_title", { object: name })}
                <Button type="button" variant="link" onClick={onClose}>
                    X
                </Button>
            </Modal.Header>
            <Modal.Body>{t("Main.deletion_confirmation", { object: name })}</Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="danger" onClick={onConfirm}>
                    {t("Main.delete")}
                </Button>
                <Feedback error={error} />
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteConfirmationModal
