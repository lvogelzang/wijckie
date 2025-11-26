import { useDailyTodosModulesCreate, useDailyTodosModulesDestroy, useDailyTodosModulesUpdate } from "@/api/endpoints/api"
import type { DailyTodosModule } from "@/api/models/api"
import RootErrorMessage from "@/components/error/form/root-error-message"
import { FormTitle } from "@/components/form/form-title"
import SaveAndDelete from "@/components/form/SaveAndDelete"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { makeUrl } from "@/helpers/LinkTreeHelper"
import { useErrorHandler } from "@/helpers/useErrorHandler"
import useLinkTree from "@/hooks/UseLinkTree"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

interface Props {
    mode: "Create" | "Update"
    module?: DailyTodosModule
}

const formSchema = z.object({
    name: z.string().min(1).max(50),
})

const DailyTodosModuleForm = ({ mode, module }: Props) => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()
    const create = useDailyTodosModulesCreate()
    const update = useDailyTodosModulesUpdate()
    const destroy = useDailyTodosModulesDestroy()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: mode === "Update" ? module!.name : "",
        },
    })

    const navigateToObject = useCallback(
        (object: DailyTodosModule) => {
            navigate(makeUrl(l.MODULES__DAILY_TODOS__ID, [object]))
        },
        [navigate, l]
    )

    const navigateToParent = useCallback(() => {
        navigate(makeUrl(l.MODULES, []))
    }, [navigate, l])

    const onSuccess = useCallback(
        (object: DailyTodosModule) => {
            if (mode === "Create") {
                navigateToObject(object)
            } else if (mode === "Update") {
                navigateToParent()
            }
        },
        [mode, navigateToObject, navigateToParent]
    )

    const onError = useCallback(
        (error: unknown) => {
            handleFormErrors(form.setError, error, ["name"])
        },
        [handleFormErrors, form.setError]
    )

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
        ({ name }) => {
            if (mode === "Create") {
                create.mutate({ data: { name } }, { onSuccess, onError })
            } else if (mode === "Update") {
                update.mutate({ id: module!.id, data: { name } }, { onSuccess, onError })
            }
        },
        [mode, create, update, module, onSuccess, onError]
    )

    const onDelete = useCallback(() => {
        return new Promise((onSuccess, onError) => {
            destroy.mutate({ id: module!.id }, { onSuccess, onError })
        })
    }, [destroy, module])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormTitle>{mode === "Create" ? t("Main.title_new") : module!.name}</FormTitle>
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
                <SaveAndDelete mode={mode} name={`${module?.name}`} onDelete={onDelete} onDeleted={navigateToParent} />
                <RootErrorMessage errors={form.formState.errors} />
            </form>
        </Form>
    )
}

export default DailyTodosModuleForm
