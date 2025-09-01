import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useCallback, useEffect, type FC } from "react"
import type { UploadJob } from "../../types/UploadJob"

interface Props<Type> {
    uploadJob: UploadJob<Type> | undefined
    file: FileList | undefined
    onSuccess: (uploadJob: UploadJob<Type>) => void
}

const UploadHandler: FC<Props<any>> = ({ uploadJob, file, onSuccess }) => {
    const upload = useCallback(() => {
        return new Promise((resolve, reject) => {
            const url = uploadJob!.fileUpload.fileUploadURL
            const item = file!.item(0)!
            if (import.meta.env.VITE_APP_UPLOAD_MODE === "POST") {
                const formData = new FormData()
                formData.append("file", item)
                const options = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
                axios.post(url, formData, options).then(resolve).catch(reject)
            } else {
                const options = {
                    headers: {
                        "Content-Type": item.type,
                    },
                }
                axios.put(url, item, options).then(resolve).catch(reject)
            }
        })
    }, [uploadJob, file])

    const { isLoading, isError, isSuccess } = useQuery({
        queryKey: ["FileUpload", uploadJob?.fileUpload.fileUUID],
        queryFn: () => upload(),
        enabled: !!uploadJob && !!file,
    })

    useEffect(() => {
        if (isSuccess) {
            onSuccess(uploadJob!)
        }
    }, [isSuccess])

    return !!uploadJob && !!file ? (
        <div>
            {isLoading ? "..." : ""}
            {isError ? "error" : ""}
        </div>
    ) : null
}

export default UploadHandler
