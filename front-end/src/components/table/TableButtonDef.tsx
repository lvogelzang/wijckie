export interface TableButtonDef {
    id: string
    label: string
    link?: string
    onClick?: () => void
    variant?: "default" | "secondary" | "link" | "destructive"
}
