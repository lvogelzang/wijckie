import RootErrorMessage from "@/components/error/form/root-error-message"
import { FormTitle } from "@/components/form/form-title"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { postAllauthClientV1AccountEmail } from "../api/endpoints/allauth"
import { useErrorHandler } from "../helpers/useErrorHandler"

const formSchema = z.object({
    email: z.email(),
})

const AddEmailAddress: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSuccess = useCallback(() => {
        navigate("/account/verify-email")
    }, [navigate])

    const onFailure = useCallback(
        (error: unknown) => {
            handleFormErrors(form.setError, error, ["email"])
        },
        [handleFormErrors, form.setError]
    )

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
        ({ email }) => {
            postAllauthClientV1AccountEmail("browser", { email }).then(onSuccess).catch(onFailure)
        },
        [onSuccess, onFailure]
    )

    return (
        <div>
            <h1>{t("AddEmailAddress.title")}</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormTitle>{t("Main.title_new")}</FormTitle>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("Main.email")}</FormLabel>
                                <FormControl>
                                    <Input {...field} data-cy="emailInput" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">{t("AddEmailAddress.submit_button")}</Button>
                    <RootErrorMessage errors={form.formState.errors} />
                </form>
            </Form>
        </div>
    )
}

export default AddEmailAddress
