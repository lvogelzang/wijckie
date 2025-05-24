import { useCallback, useContext, type FC } from "react"
import { Button, Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Link } from "react-router-dom"
import { useOptionalCurrentUser, UserSettingsContext } from "../contexts/UserSettingsContext"
import { setOptionalError } from "../helpers/FormHelper"
import { login } from "../services/User"

interface Inputs {
    username: string
    password: string
}

const LoginPage: FC = () => {
    const { reloadUserSettings } = useContext(UserSettingsContext)
    const currentUser = useOptionalCurrentUser()

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
            <h1>Login {currentUser?.username}</h1>
            <Link to="/dashboard">Dashboard</Link>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    <Form.Label>E-mailadres</Form.Label>
                    <Form.Control type="email" autoComplete="email" {...register("username")} isInvalid={!!errors.username} autoFocus />
                    <Form.Control.Feedback type="invalid" data-cy="email_errors">
                        {errors.username?.message}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Wachtwoord</Form.Label>
                    <Form.Control type="password" {...register("password")} isInvalid={!!errors.password} />
                    <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Button type="submit">Login</Button>
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
