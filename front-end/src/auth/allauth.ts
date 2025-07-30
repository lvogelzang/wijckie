export const Flows = Object.freeze({
    LOGIN_BY_CODE: "login_by_code",
    MFA_AUTHENTICATE: "mfa_authenticate",
    MFA_REAUTHENTICATE: "mfa_reauthenticate",
    MFA_WEBAUTHN_SIGNUP: "mfa_signup_webauthn",
    VERIFY_EMAIL: "verify_email",
})

export type FlowId = "login_by_code" | "mfa_authenticate" | "mfa_reauthenticate" | "mfa_signup_webauthn" | "verify_email"

export const AuthenticatorTypes = Object.freeze({
    WEBAUTHN: "webauthn",
})

export type AuthenticatorType = "webauthn"
