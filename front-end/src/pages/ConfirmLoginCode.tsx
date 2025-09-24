import { useCallback, useMemo, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import type { ObjectSchema } from "yup"
import * as yup from "yup"
import { postAllauthClientV1AuthCodeConfirm } from "../api/endpoints/allauth"
import type { AuthenticatedResponse } from "../api/models/allauth"
import WButton from "../components/button/WButton"
import RootErrorMessage from "../components/form/RootErrorMessage"
import WErrorMessage from "../components/form/WErrorMessage"
import WField from "../components/form/WField"
import WForm from "../components/form/WForm"
import WInput from "../components/form/WInput"
import WLabel from "../components/form/WLabel"
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
        [handleFormErrors, setError]
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
            <WForm onSubmit={handleSubmit(onSubmit)}>
                <WField>
                    <WLabel>{t("ConfirmLoginCode.code")}</WLabel>
                    <WInput type="text" {...register("code")} invalid={!!errors.code} autoFocus data-cy="confirmCodeInput" />
                    <WErrorMessage error={errors.code} />
                </WField>
                <WField>
                    <WButton type="submit">{t("ConfirmLoginCode.submit_button")}</WButton>
                </WField>
                <RootErrorMessage errors={errors} />
                <p>
                    <Trans i18nKey="ConfirmLoginCode.back_to_login">
                        Already a passkey? Go back to
                        <Link to="/account/logout">Login</Link>.
                    </Trans>
                </p>
            </WForm>
        </div>
    )
}

export default ConfirmLoginCode
