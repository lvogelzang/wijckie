import RootErrorMessage from "@/components/error/form/root-error-message"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { create, parseCreationOptionsFromJSON, type CredentialCreationOptionsJSON, type RegistrationPublicKeyCredential } from "@github/webauthn-json/browser-ponyfill"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { z } from "zod"
import { getAllauthClientV1AuthWebauthnSignup, putAllauthClientV1AuthWebauthnSignup } from "../api/endpoints/allauth"
import type { AddWebAuthnAuthenticatorBody, AuthenticatedResponse, StatusOK } from "../api/models/allauth"
import { useErrorHandler } from "../helpers/useErrorHandler"

const formSchema = z.object({
    name: z.string().min(1).max(50),
})

const CreateSignupPasskey: FC = () => {
    const { t } = useTranslation()
    const { handleFormErrors } = useErrorHandler()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSuccess = useCallback((response: AuthenticatedResponse) => {
        const event = new CustomEvent("allauth.auth.change", { detail: response })
        document.dispatchEvent(event)
    }, [])

    const onFailure = useCallback(
        (error: unknown) => {
            handleFormErrors(form.setError, error, ["name"])
        },
        [handleFormErrors, form.setError]
    )

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
        ({ name }) => {
            getAllauthClientV1AuthWebauthnSignup("browser")
                .then((optionsResponse) => {
                    const optionsResponseData = optionsResponse as unknown as {
                        data: { creation_options: CredentialCreationOptionsJSON }
                        status: StatusOK
                    }
                    const options = parseCreationOptionsFromJSON(optionsResponseData.data.creation_options)
                    create(options)
                        .then((credential: RegistrationPublicKeyCredential) => {
                            putAllauthClientV1AuthWebauthnSignup("browser", {
                                name,
                                credential: credential as unknown as AddWebAuthnAuthenticatorBody,
                            })
                                .then(onSuccess)
                                .catch(onFailure)
                        })
                        .catch(onFailure)
                })
                .catch(onFailure)
        },
        [onSuccess, onFailure]
    )

    return (
        <div>
            <h1>{t("CreateSignupPasskey.title")}</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("Main.name")}</FormLabel>
                                <FormControl>
                                    <Input {...field} data-cy="nameInput" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" data-cy="submitButton">
                        {t("CreateSignupPasskey.submit_button")}
                    </Button>
                    <RootErrorMessage errors={form.formState.errors} />
                </form>
            </Form>
            <p>
                <Trans i18nKey="CreateSignupPasskey.already_an_account">
                    Already have an account? Go to
                    <Link to="/account/authenticate/webauthn">Login</Link>.
                </Trans>
            </p>
        </div>
    )
}

export default CreateSignupPasskey
