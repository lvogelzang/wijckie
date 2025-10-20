import RootErrorMessage from "@/components/error/form/root-error-message"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useMemo, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useLoaderData, useNavigate, useParams } from "react-router-dom"
import { z } from "zod"
import { deleteAllauthClientV1AccountAuthenticatorsWebauthn, putAllauthClientV1AccountAuthenticatorsWebauthn } from "../api/endpoints/allauth"
import type { AuthenticatorList } from "../api/models/allauth"
import { AuthenticatorTypes } from "../auth/allauth"
import { useErrorHandler } from "../helpers/useErrorHandler"

const formSchema = z.object({
    name: z.string().min(1).max(50),
})

const UpdatePasskey: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { id } = useParams()
    const { handleFormErrors } = useErrorHandler()
    const authenticators = useLoaderData<AuthenticatorList>()
    const passkey = useMemo(() => authenticators.filter((a) => a.type === AuthenticatorTypes.WEBAUTHN).find((a) => a.id === parseInt(id!))!, [authenticators, id])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: passkey.name,
        },
    })

    const onSuccess = useCallback(() => {
        navigate("/account/my")
    }, [navigate])

    const onFailure = useCallback(
        (error: unknown) => {
            handleFormErrors(form.setError, error, ["name"])
        },
        [handleFormErrors, form.setError]
    )

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
        ({ name }) => {
            putAllauthClientV1AccountAuthenticatorsWebauthn("browser", { id: passkey.id, name }).then(onSuccess).catch(onFailure)
        },
        [passkey, onSuccess, onFailure]
    )

    const onDelete = useCallback(() => {
        deleteAllauthClientV1AccountAuthenticatorsWebauthn("browser", {
            authenticators: [passkey.id],
        })
            .then(onSuccess)
            .catch(onFailure)
    }, [passkey, onSuccess, onFailure])

    return (
        <div>
            <h1>{t("UpdatePasskey.title")}</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("UpdatePasskey.name")}</FormLabel>
                                <FormControl>
                                    <Input {...field} data-cy="nameInput" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">{t("UpdatePasskey.submit_button")}</Button>
                    <Button type="button" variant="destructive" onClick={onDelete} data-cy="deleteButton">
                        {t("UpdatePasskey.delete_button")}
                    </Button>
                    <RootErrorMessage errors={form.formState.errors} />
                </form>
            </Form>
        </div>
    )
}

export default UpdatePasskey
