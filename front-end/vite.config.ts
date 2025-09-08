import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import istanbul from "vite-plugin-istanbul"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd())
    return {
        build: {
            sourcemap: env.VITE_APP_ENV === "Dev",
        },
        plugins: [
            react(),
            istanbul({
                include: "src/*",
                exclude: ["node_modules", "src/api"],
                extension: [".ts", ".tsx"],
                requireEnv: true,
            }),
        ],
    }
})
