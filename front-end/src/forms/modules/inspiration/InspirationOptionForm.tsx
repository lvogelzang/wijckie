import {
    useInspirationOptionsCreate,
    useInspirationOptionsDestroy,
    useInspirationOptionsPartialUpdate,
    useInspirationOptionsUpdate,
    type InspirationOptionsCreateMutationResult,
    type InspirationOptionsUpdateMutationResult,
} from "@/api/endpoints/api"
import { TypeEnum, type FileUpload, type InspirationModule, type InspirationOption } from "@/api/models/api"
import RootErrorMessage from "@/components/error/form/root-error-message"
import { FormTitle } from "@/components/form/form-title"
import SaveAndDelete from "@/components/form/SaveAndDelete"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { makeUrl } from "@/helpers/LinkTreeHelper"
import { handleUpload } from "@/helpers/uploadHelper"
import { useErrorHandler } from "@/helpers/useErrorHandler"
import useInspirationOptionTypeOptions from "@/helpers/useInspirationOptionTypeOptions"
import useLinkTree from "@/hooks/UseLinkTree"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

interface Props {
    mode: "Create" | "Update"
    module: InspirationModule
    option?: InspirationOption
}

const formSchema = z
    .object({
        name: z.string().min(1).max(50),
        type: z.enum(TypeEnum),
        text: z.string().optional(),
        image: z.file().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.type === "text" && (!data.text || data.text.length === 0)) {
            ctx.addIssue({ path: ["text"], code: "custom" })
        } else if (data.type === "image" && !data.image) {
            ctx.addIssue({ path: ["image"], code: "custom" })
        }
    })

const InspirationOptionForm = ({ mode, module, option }: Props) => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const navigate = useNavigate()
    const typeOptions = useInspirationOptionTypeOptions()
    const { handleFormErrors } = useErrorHandler()
    const create = useInspirationOptionsCreate()
    const update = useInspirationOptionsUpdate()
    const partialUpdate = useInspirationOptionsPartialUpdate()
    const destroy = useInspirationOptionsDestroy()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: mode === "Update" ? option!.name : "",
            type: mode === "Update" ? option!.type : "text",
            text: mode === "Update" ? option!.text : "",
        },
    })

    const navigateToParent = useCallback(() => {
        navigate(makeUrl(l.MODULES__INSPIRATION__ID, [module]))
    }, [navigate, l, module])

    const onError = useCallback(
        (error: unknown) => {
            handleFormErrors(form.setError, error, ["name", "type", "text", "image"])
        },
        [handleFormErrors, form.setError]
    )

    const attachFileUploadToOption = useCallback(
        (fileUpload: FileUpload, inspirationOption: InspirationOptionsCreateMutationResult | InspirationOptionsUpdateMutationResult) => {
            partialUpdate.mutate({ id: inspirationOption.id, data: { image: fileUpload.id } }, { onSuccess: navigateToParent, onError })
        },
        [partialUpdate, navigateToParent, onError]
    )

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
        ({ name, type, text, image }) => {
            if (mode === "Create") {
                create.mutate(
                    {
                        data: {
                            module: module.id,
                            name,
                            type,
                            text: type === "text" ? text : undefined,
                        },
                    },
                    {
                        onSuccess: image
                            ? (inspirationOption: InspirationOptionsCreateMutationResult) => handleUpload(inspirationOption, "image", image, attachFileUploadToOption, onError)
                            : navigateToParent,
                        onError,
                    }
                )
            } else if (mode === "Update") {
                update.mutate(
                    { id: option!.id, data: { name, type, text: type === "text" ? text : undefined } },
                    {
                        onSuccess: image
                            ? (inspirationOption: InspirationOptionsUpdateMutationResult) => handleUpload(inspirationOption, "image", image, attachFileUploadToOption, onError)
                            : navigateToParent,
                        onError,
                    }
                )
            }
        },
        [mode, module, option, create, update, navigateToParent, onError]
    )

    const onDelete = useCallback(() => {
        return new Promise((onSuccess, onError) => {
            destroy.mutate({ id: option!.id }, { onSuccess, onError })
        })
    }, [destroy, option])

    const selectedType = form.watch("type")

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormTitle>{mode === "Create" ? t("Main.title_new") : option!.name}</FormTitle>
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
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("Main.type")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl data-cy="typeSelect">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a verified email to display" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {typeOptions.map(({ id, label }) => (
                                        <SelectItem key={id} value={id} data-cy={`${id}Option`}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {selectedType === "text" ? (
                    <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("Main.text")}</FormLabel>
                                <FormControl>
                                    <Input {...field} data-cy="textInput" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ) : null}
                {selectedType === "image" ? (
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                                <FormLabel>{t("Main.image")}</FormLabel>
                                <FormControl>
                                    <Input {...fieldProps} type="file" accept="image/*" onChange={(event) => onChange(event.target.files && event.target.files[0])} data-cy="imageInput" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ) : null}
                <SaveAndDelete mode={mode} name={`${option?.name}`} onDelete={onDelete} onDeleted={navigateToParent} />
                <RootErrorMessage errors={form.formState.errors} />
            </form>
        </Form>
    )
}

export default InspirationOptionForm
