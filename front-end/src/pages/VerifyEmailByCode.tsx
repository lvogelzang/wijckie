import { useCallback, useMemo, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import * as yup from "yup"
import { ObjectSchema } from "yup"
import { postAllauthClientV1AuthEmailVerify } from "../api/endpoints/allauth"
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
            <WForm onSubmit={handleSubmit(onSubmit)}>
                <WField>
                    <WLabel>{t("VerifyEmailPage.code")}</WLabel>
                    <WInput type="text" {...register("key")} invalid={!!errors.key} autoFocus data-cy="verificationCodeInput" />
                    <WErrorMessage error={errors.key} />
                </WField>
                <WField>
                    <WButton type="submit">{t("VerifyEmailPage.submit_button")}</WButton>
                </WField>
                <RootErrorMessage errors={errors} />
            </WForm>
            <p>
                <Trans i18nKey="VerifyEmailByCode.already_an_account">
                    Already have an account? Go to
                    <Link to="/account/logout">Login</Link>.
                </Trans>
            </p>
        </div>
    )
}

export default VerifyEmailByCode
