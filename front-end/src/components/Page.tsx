import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type React from "react"

const pageVariants = cva("relative w-full pt-[80px] mb-[-60px] pb-[60px]", {
    variants: {
        variant: {
            anonymous: "bg-[url('/gradient-1.svg')] flex flex-col items-center justify-center",
            dashboard: "bg-[url('/gradient-2.svg')]",
            configuration: "bg-[url('/gradient-2.svg')]",
        },
    },
    defaultVariants: {
        variant: "configuration",
    },
})

function Page({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof pageVariants>) {
    return <div className={cn(pageVariants({ variant, className }))} {...props} />
}

export { Page }
