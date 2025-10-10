export interface TableButtonDef {
    label: string
    link?: string
    onClick?: () => void
    variant?: "default" | "secondary" | "link" | "destructive"
}
