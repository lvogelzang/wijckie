import { useCallback, useMemo, type FC } from "react"
import { Button, Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import { ObjectSchema } from "yup"
import { postAllauthClientV1AuthEmailVerify } from "../api/endpoints/allauth"
import ErrorMessage from "../components/ErrorMessage"
import { isAllauthResponse401 } from "../helpers/AllauthHelper"
import { useErrorHandler } from "../helpers/useErrorHandler"
import { useYupValidationResolver } from "../helpers/useYupValidationResolver"

interface Inputs {
    key: string
}

const VerifyEmailByCode: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()

    const validationSchema: ObjectSchema<Inputs> = useMemo(() => {
        return yup.object({
            key: yup.string().required(),
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
        navigate("/account/signup/passkey/create")
    }, [navigate])

    const onFailure = useCallback(
        (error: unknown) => {
            if (isAllauthResponse401(error)) {
                onSuccess()
                return
            }
            handleFormErrors(setError, error, ["key"])
        },
        [onSuccess, handleFormErrors, setError]
    )

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ key }) => {
            postAllauthClientV1AuthEmailVerify("browser", { key }).then(onSuccess).catch(onFailure)
        },
        [onSuccess, onFailure]
    )

    return (
        <div>
            <h1>{t("VerifyEmailPage.title")}</h1>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    <Form.Label>{t("VerifyEmailPage.code")}</Form.Label>
                    <Form.Control type="text" {...register("key")} isInvalid={!!errors.key} autoFocus />
                    <Form.Control.Feedback type="invalid">
                        <ErrorMessage error={errors.key} />
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Button type="submit">{t("VerifyEmailPage.submit_button")}</Button>
                </Form.Group>
                <Form.Group hidden={!errors.root}>
                    <Form.Control type="hidden" isInvalid={!!errors.root} />
                    <Form.Control.Feedback type="invalid">
                        <ErrorMessage error={errors.root} />
                    </Form.Control.Feedback>
                </Form.Group>
            </Form>
        </div>
    )
}

export default VerifyEmailByCode
