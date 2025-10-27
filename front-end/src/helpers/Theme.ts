export type Theme = "light" | "dark" | "auto"

export function applyTheme(theme: Theme) {
    const root = document.documentElement

    if (theme === "auto") {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        root.classList.toggle("dark", systemDark)
    } else {
        root.classList.toggle("dark", theme === "dark")
    }

    localStorage.setItem("theme", theme)
}

export function initTheme() {
    const saved = (localStorage.getItem("theme") as Theme) || "auto"
    applyTheme(saved)

    if (saved === "auto") {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
            applyTheme("auto")
        })
    }
}
