import { useCallback, useMemo, type FC } from "react"
import { Button, Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import type { ObjectSchema } from "yup"
import * as yup from "yup"
import { postAllauthClientV1AuthCodeConfirm } from "../api/endpoints/allauth"
import type { AuthenticatedResponse } from "../api/models/allauth"
import ErrorMessage from "../components/ErrorMessage"
import { useErrorHandler } from "../helpers/useErrorHandler"
import { useYupValidationResolver } from "../helpers/useYupValidationResolver"

interface Inputs {
    code: string
}

const ConfirmLoginCode: FC = () => {
    const { t } = useTranslation()
    const { handleFormErrors } = useErrorHandler()

    const validationSchema: ObjectSchema<Inputs> = useMemo(() => {
        return yup.object({
            code: yup.string().required(),
        })
    }, [])

    const resolver = useYupValidationResolver(validationSchema)

    const {
        register,
        setError,
        formState: { errors },
        handleSubmit,
    } = useForm<Inputs>({ resolver, mode: "onSubmit", reValidateMode: "onSubmit" })

    const onSuccess = useCallback((response: AuthenticatedResponse) => {
        const event = new CustomEvent("allauth.auth.change", { detail: response })
        document.dispatchEvent(event)
    }, [])

    const onFailure = useCallback(
        (error: unknown) => {
            handleFormErrors(setError, error, ["code"])
        },
        [onSuccess, setError, handleFormErrors]
    )

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ code }) => {
            postAllauthClientV1AuthCodeConfirm("browser", { code }).then(onSuccess).catch(onFailure)
        },
        [onSuccess, onFailure]
    )

    return (
        <div>
            <h1>{t("ConfirmLoginCode.title")}</h1>
            <p>{t("ConfirmLoginCode.body")}</p>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    <Form.Label>{t("ConfirmLoginCode.code")}</Form.Label>
                    <Form.Control {...register("code")} isInvalid={!!errors.code} autoFocus />
                    <Form.Control.Feedback type="invalid">
                        <ErrorMessage error={errors.code} />
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Button type="submit">{t("ConfirmLoginCode.submit_button")}</Button>
                </Form.Group>
                <Form.Group hidden={!errors.root}>
                    <Form.Control type="hidden" isInvalid={!!errors.root} />
                    <Form.Control.Feedback type="invalid">
                        <ErrorMessage error={errors.root} />
                    </Form.Control.Feedback>
                </Form.Group>
                <p>
                    <Trans i18nKey="ConfirmLoginCode.back_to_login">
                        Already a passkey? Go back to
                        <Link to="/account/login">Login</Link>.
                    </Trans>
                </p>
            </Form>
        </div>
    )
}

export default ConfirmLoginCode
