import RootErrorMessage from "@/components/error/form/root-error-message"
import { Page } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useLinkTree, { makeUrl } from "@/hooks/UseLinkTree"
import { create, parseCreationOptionsFromJSON, type CredentialCreationOptionsJSON, type RegistrationPublicKeyCredential } from "@github/webauthn-json/browser-ponyfill"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { getAllauthClientV1AccountAuthenticatorsWebauthn, postAllauthClientV1AccountAuthenticatorsWebauthn } from "../../api/endpoints/allauth"
import type { AddWebAuthnAuthenticatorBody, StatusOK } from "../../api/models/allauth"
import { useErrorHandler } from "../../helpers/useErrorHandler"

const formSchema = z.object({
    name: z.string().min(1).max(50),
})

const CreatePasskey = () => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSuccess = useCallback(() => {
        navigate(makeUrl(l.MY_ACCOUNT, []))
    }, [navigate, l])

    const onFailure = useCallback(
        (error: unknown) => {
            handleFormErrors(form.setError, error, ["name"])
        },
        [handleFormErrors, form.setError]
    )

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
        ({ name }) => {
            getAllauthClientV1AccountAuthenticatorsWebauthn("browser")
                .then((optionsResponse) => {
                    const optionsResponseData = optionsResponse as unknown as {
                        data: { creation_options: CredentialCreationOptionsJSON }
                        status: StatusOK
                    }
                    const options = parseCreationOptionsFromJSON(optionsResponseData.data.creation_options)
                    create(options)
                        .then((credential: RegistrationPublicKeyCredential) => {
                            postAllauthClientV1AccountAuthenticatorsWebauthn("browser", {
                                credential: credential as unknown as AddWebAuthnAuthenticatorBody,
                                name,
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
        <Page variant="configuration">
            <h1>{t("CreatePasskey.title")}</h1>
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
                    <Button type="submit">{t("CreatePasskey.submit_button")}</Button>
                    <RootErrorMessage errors={form.formState.errors} />
                </form>
            </Form>
        </Page>
    )
}

export default CreatePasskey
