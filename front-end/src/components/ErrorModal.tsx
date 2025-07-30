import { useCallback, type FC } from "react"
import { Button, Modal } from "react-bootstrap"
import { useTranslation } from "react-i18next"

interface Props {
    error: string | null
    setError: (error: string | null) => void
}

const ErrorModal: FC<Props> = ({ error, setError }) => {
    const { t } = useTranslation()

    const onClose = useCallback(() => setError(null), [setError])

    return (
        <Modal show={!!error} onHide={onClose}>
            <Modal.Header>
                {t("ErrorModal.title")}
                <Button onClick={onClose}>X</Button>
            </Modal.Header>
            <Modal.Body>{error}</Modal.Body>
        </Modal>
    )
}

export default ErrorModal
