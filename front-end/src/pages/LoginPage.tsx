import { useCallback, useContext, type FC } from "react"
import { Button, Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { UserSettingsContext } from "../contexts/UserSettingsContext"
import { setOptionalError } from "../helpers/FormHelper"
import { login } from "../services/User"

interface Inputs {
    username: string
    password: string
}

const LoginPage: FC = () => {
    const { t } = useTranslation()
    const { reloadUserSettings } = useContext(UserSettingsContext)

    const {
        register,
        setError,
        formState: { errors },
        handleSubmit,
    } = useForm<Inputs>()

    const onFailure = useCallback(
        (error: any) => {
            const data = error.response && error.response.data ? error.response.data : {}
            setOptionalError(setError, "username", data.username)
            setOptionalError(setError, "password", data.password)
            setOptionalError(setError, "root", data.nonFieldErrors)
        },
        [setError]
    )

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ username, password }) => {
            login(username, password).then(reloadUserSettings).catch(onFailure)
        },
        [reloadUserSettings, onFailure]
    )

    return (
        <div>
            <h1>{t("LoginPage.title")}</h1>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    <Form.Label>{t("LoginPage.email_address")}</Form.Label>
                    <Form.Control type="email" autoComplete="email" {...register("username")} isInvalid={!!errors.username} autoFocus />
                    <Form.Control.Feedback type="invalid" data-cy="email_errors">
                        {errors.username?.message}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>{t("LoginPage.password")}</Form.Label>
                    <Form.Control type="password" {...register("password")} isInvalid={!!errors.password} />
                    <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Button type="submit">{t("Buttons.login")}</Button>
                </Form.Group>
                <Form.Group hidden={!errors.root}>
                    <Form.Control type="hidden" isInvalid={!!errors.root} />
                    <Form.Control.Feedback type="invalid">{errors.root?.message}</Form.Control.Feedback>
                </Form.Group>
            </Form>
        </div>
    )
}

export default LoginPage
