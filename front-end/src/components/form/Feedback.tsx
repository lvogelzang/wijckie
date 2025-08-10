import type { FC } from "react"
import { Form } from "react-bootstrap"

interface Props {
    error?: string
}

const Feedback: FC<Props> = ({ error }) => {
    return (
        <Form.Group hidden={!error}>
            <Form.Control type="hidden" isInvalid={!!error} />
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </Form.Group>
    )
}

export default Feedback
