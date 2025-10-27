import RootErrorMessage from "@/components/error/form/root-error-message"
import { Page } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { z } from "zod"
import { postAllauthClientV1AuthCodeConfirm } from "../../api/endpoints/allauth"
import type { AuthenticatedResponse } from "../../api/models/allauth"
import { useErrorHandler } from "../../helpers/useErrorHandler"

const formSchema = z.object({
    code: z.string().length(6),
})

const ConfirmLoginCode: FC = () => {
    const { t } = useTranslation()
    const { handleFormErrors } = useErrorHandler()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
        },
    })

    const onSuccess = useCallback((response: AuthenticatedResponse) => {
        const event = new CustomEvent("allauth.auth.change", { detail: response })
        document.dispatchEvent(event)
    }, [])

    const onFailure = useCallback(
        (error: unknown) => {
            handleFormErrors(form.setError, error, ["code"])
        },
        [handleFormErrors, form.setError]
    )

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
        ({ code }) => {
            postAllauthClientV1AuthCodeConfirm("browser", { code }).then(onSuccess).catch(onFailure)
        },
        [onSuccess, onFailure]
    )

    return (
        <Page variant="anonymous">
            <Card>
                <div className="m-auto flex flex-col items-center gap-6 text-center max-w-96">
                    <h1>{t("ConfirmLoginCode.title")}</h1>
                    <p>{t("ConfirmLoginCode.body")}</p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("ConfirmLoginCode.code")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} autoComplete="email" autoFocus data-cy="confirmCodeInput" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">{t("ConfirmLoginCode.submit_button")}</Button>
                            <RootErrorMessage errors={form.formState.errors} />
                            <p>
                                <Trans i18nKey="ConfirmLoginCode.back_to_login">
                                    Already a passkey? Go back to
                                    <Link to="/account/logout">Login</Link>.
                                </Trans>
                            </p>
                        </form>
                    </Form>
                </div>
            </Card>
        </Page>
    )
}

export default ConfirmLoginCode
