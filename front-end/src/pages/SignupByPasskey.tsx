import { useCallback, useMemo, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import * as yup from "yup"
import { ObjectSchema } from "yup"
import { postAllauthClientV1AuthWebauthnSignup } from "../api/endpoints/allauth"
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

const SignupByPasskey: FC = () => {
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
        navigate("/account/verify-email")
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
            postAllauthClientV1AuthWebauthnSignup("browser", { email }).then(onSuccess).catch(onFailure)
        },
        [onSuccess, onFailure]
    )

    return (
        <div>
            <h1>{t("SignUpPage.title")}</h1>
            <WForm onSubmit={handleSubmit(onSubmit)}>
                <WField>
                    <WLabel>{t("SignUpPage.email_address")}</WLabel>
                    <WInput type="email" autoComplete="email" {...register("email")} invalid={!!errors.email} autoFocus data-cy="emailInput" />
                    <WErrorMessage error={errors.email} />
                </WField>
                <WField>
                    <WButton type="submit">{t("SignUpPage.submit_button")}</WButton>
                </WField>
                <RootErrorMessage errors={errors} />
            </WForm>
            <p>
                <Trans i18nKey="SignUpPage.already_an_account">
                    Already have an account? Go to
                    <Link to="/account/authenticate/webauthn" data-cy="toLoginLink">
                        Login
                    </Link>
                    .
                </Trans>
            </p>
        </div>
    )
}

export default SignupByPasskey
