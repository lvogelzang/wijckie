import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"

interface Props {
    error: string | undefined
    setError: (error: string | undefined) => void
}

// TODO: Add content, remove error on close.
const ErrorDialog = ({ error, setError }: Props) => {
    return (
        <AlertDialog open={!!error}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogContent>{error}</AlertDialogContent>
                <AlertDialogFooter>
                    <AlertDialogCancel>OK</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ErrorDialog
