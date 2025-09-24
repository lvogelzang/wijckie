import { useCallback, useEffect, useMemo, useState, type FC } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLoaderData, useNavigate } from "react-router-dom"
import { deleteAllauthClientV1AccountEmail, getAllauthClientV1AccountEmail, patchAllauthClientV1AccountEmail, putAllauthClientV1AccountEmail } from "../api/endpoints/allauth"
import { type AuthenticatorList, type EmailAddressesResponse } from "../api/models/allauth"
import { AuthenticatorTypes } from "../auth/allauth"
import WButton from "../components/button/WButton"
import ErrorDialog from "../components/ErrorDialog"

interface EmailResponse {
    fetching: boolean
    content: EmailAddressesResponse | undefined
}

const MyAccount: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const authenticators = useLoaderData<AuthenticatorList>()

    const [emailResponse, setEmailResponse] = useState<EmailResponse>({ fetching: true, content: undefined })
    const [error, setError] = useState<string | null>(null)

    const keys = useMemo(() => authenticators.filter((a) => a.type === AuthenticatorTypes.WEBAUTHN), [authenticators])

    const onEmailSuccess = useCallback(
        (content: EmailAddressesResponse) => {
            setEmailResponse({ fetching: false, content })
        },
        [setEmailResponse]
    )

    const onEmailFailure = useCallback(() => {
        setError(t("ErrorMessage.general"))
    }, [setError, t])

    const markAsPrimary = (email: string) => {
        patchAllauthClientV1AccountEmail("browser", { email, primary: true }).then(onEmailSuccess).catch(onEmailFailure)
    }

    const requestEmailVerification = useCallback(
        (email: string) => {
            putAllauthClientV1AccountEmail("browser", { email })
                .then(() => navigate("/account/verify-email"))
                .catch(onEmailFailure)
        },
        [navigate, onEmailFailure]
    )

    const deleteEmail = useCallback(
        (email: string) => {
            deleteAllauthClientV1AccountEmail("browser", { email }).then(onEmailSuccess).catch(onEmailFailure)
        },
        [onEmailSuccess, onEmailFailure]
    )

    useEffect(() => {
        getAllauthClientV1AccountEmail("browser").then(onEmailSuccess).catch(onEmailFailure)
    }, [onEmailSuccess, onEmailFailure])

    return (
        <div>
            <h1>{t("MyAccount.title")}</h1>
            <h2>{t("MyAccount.email_addresses")}</h2>
            <ErrorDialog error={error} setError={setError} />
            <table>
                <thead>
                    <tr>
                        <th>{t("MyAccount.email_address")}</th>
                        <th>{t("MyAccount.email_verified")}</th>
                        <th>{t("MyAccount.email_primary")}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {emailResponse.content?.data.map(({ email, verified, primary }) => {
                        return (
                            <tr key={email} data-cy="emailAddressRow">
                                <td data-cy="emailValue">{email}</td>
                                <td data-cy="verifiedValue">{verified ? "y" : "n"}</td>
                                <td>
                                    <input onChange={() => markAsPrimary(email)} type="radio" checked={primary} disabled={!verified} data-cy="primaryRadioButton" />
                                </td>
                                <td>
                                    {!verified ? (
                                        <WButton onClick={() => requestEmailVerification(email)} data-cy="verifyButton">
                                            {t("MyAccount.email_verify")}
                                        </WButton>
                                    ) : null}
                                    {!primary ? (
                                        <WButton onClick={() => deleteEmail(email)} data-cy="deleteButton">
                                            {t("MyAccount.email_delete")}
                                        </WButton>
                                    ) : null}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Link to="/account/my/email-addresses/add" data-cy="addEmailLink">
                {t("MyAccount.add_email_address")}
            </Link>
            <h2>{t("MyAccount.passkeys")}</h2>
            <table>
                <thead>
                    <tr>
                        <th>{t("MyAccount.passkey_name")}</th>
                        <th>{t("MyAccount.passkey_created_at")}</th>
                        <th>{t("MyAccount.passkey_last_used_at")}</th>
                    </tr>
                </thead>
                <tbody>
                    {keys.map((key) => {
                        return (
                            <tr key={key.id}>
                                <td>
                                    <Link to={`/account/my/passkeys/${key.id}`}>{key.name}</Link>
                                </td>
                                <td>{key.created_at}</td>
                                <td>{key.last_used_at}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Link to="/account/my/passkeys/add" data-cy="addPasskeyLink">
                {t("MyAccount.add_passkey")}
            </Link>
        </div>
    )
}

export default MyAccount
