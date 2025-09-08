import { defineConfig } from "cypress"

export default defineConfig({
    e2e: {
        viewportWidth: 1300,
        viewportHeight: 700,
        screenshotOnRunFailure: false,
        video: false,
        setupNodeEvents(on, config) {
            config.baseUrl = config.env.FRONTEND_URL
            return config
        },
    },
})
