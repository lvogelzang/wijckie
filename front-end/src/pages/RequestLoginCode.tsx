import { useCallback, useMemo, type FC } from "react"
import { Button, Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import * as yup from "yup"
import { ObjectSchema } from "yup"
import { postAllauthClientV1AuthCodeRequest } from "../api/endpoints/allauth"
import ErrorMessage from "../components/ErrorMessage"
import { isAllauthResponse401 } from "../helpers/AllauthHelper"
import { useErrorHandler } from "../helpers/useErrorHandler"
import { useYupValidationResolver } from "../helpers/useYupValidationResolver"

interface Inputs {
    email: string
}

const RequestLoginCode: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()

    const validationSchema: ObjectSchema<Inputs> = useMemo(() => {
        return yup.object({
            email: yup.string().email().required(),
        })
    }, [])

    const resolver = useYupValidationResolver(validationSchema)

    const {
        register,
        setError,
        formState: { errors },
        handleSubmit,
    } = useForm<Inputs>({ resolver, mode: "onSubmit", reValidateMode: "onSubmit" })

    const onSuccess = useCallback(() => {
        navigate("/account/login/code/confirm")
    }, [navigate])

    const onFailure = useCallback(
        (error: unknown) => {
            if (isAllauthResponse401(error)) {
                onSuccess()
                return
            }
            handleFormErrors(setError, error, ["email"])
        },
        [onSuccess, setError, handleFormErrors]
    )

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ email }) => {
            postAllauthClientV1AuthCodeRequest("browser", { email }).then(onSuccess).catch(onFailure)
        },
        [onSuccess, onFailure]
    )

    return (
        <div>
            <h1>{t("RequestLoginCodePage.title")}</h1>
            <p>{t("RequestLoginCodePage.body")}</p>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    <Form.Label>{t("RequestLoginCodePage.email_address")}</Form.Label>
                    <Form.Control type="email" autoComplete="email" {...register("email")} isInvalid={!!errors.email} autoFocus />
                    <Form.Control.Feedback type="invalid">
                        <ErrorMessage error={errors.email} />
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Button type="submit">{t("RequestLoginCodePage.submit_button")}</Button>
                </Form.Group>
                <Form.Group hidden={!errors.root}>
                    <Form.Control type="hidden" isInvalid={!!errors.root} />
                    <Form.Control.Feedback type="invalid">
                        <ErrorMessage error={errors.root} />
                    </Form.Control.Feedback>
                </Form.Group>
                <p>
                    <Trans i18nKey="RequestLoginCodePage.back_to_login">
                        Already a passkey? Go back to
                        <Link to="/account/authenticate/webauthn">Login</Link>.
                    </Trans>
                </p>
            </Form>
        </div>
    )
}

export default RequestLoginCode
