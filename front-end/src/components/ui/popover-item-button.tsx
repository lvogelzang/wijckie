import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

const popoverItemButtonVariants = cva("w-full text-left px-4 py-2 font-medium text-xs/6 text-gray-700 focus-visible:outline-0 hover:text-gray-800", {
    variants: {
        variant: {
            default: "hover:bg-gray-50",
        },
    },
    defaultVariants: {
        variant: "default",
    },
})

function PopoverItemButton({ className, variant, ...props }: ComponentProps<"button"> & VariantProps<typeof popoverItemButtonVariants>) {
    return <button data-slot="button" className={cn(popoverItemButtonVariants({ variant, className }))} {...props} />
}

export { PopoverItemButton, popoverItemButtonVariants }
