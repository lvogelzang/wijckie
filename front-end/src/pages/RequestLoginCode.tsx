import { useCallback, useMemo, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import * as yup from "yup"
import { ObjectSchema } from "yup"
import { postAllauthClientV1AuthCodeRequest } from "../api/endpoints/allauth"
import WButton from "../components/button/WButton"
import RootErrorMessage from "../components/form/RootErrorMessage"
import WErrorMessage from "../components/form/WErrorMessage"
import WField from "../components/form/WField"
import WForm from "../components/form/WForm"
import WInput from "../components/form/WInput"
import WLabel from "../components/form/WLabel"
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
            <WForm onSubmit={handleSubmit(onSubmit)}>
                <WField>
                    <WLabel>{t("RequestLoginCodePage.email_address")}</WLabel>
                    <WInput type="email" autoComplete="email" {...register("email")} invalid={!!errors.email} autoFocus data-cy="emailInput" />
                    <WErrorMessage error={errors.email} />
                </WField>
                <WField>
                    <WButton type="submit" data-cy="submitButton">
                        {t("RequestLoginCodePage.submit_button")}
                    </WButton>
                </WField>
                <RootErrorMessage errors={errors} />
                <p>
                    <Trans i18nKey="RequestLoginCodePage.back_to_login">
                        Already a passkey? Go back to
                        <Link to="/account/logout">Login</Link>.
                    </Trans>
                </p>
            </WForm>
        </div>
    )
}

export default RequestLoginCode
