import registerCodeCoverageTasks from "@cypress/code-coverage/task"
import { defineConfig } from "cypress"
import sqlite3 from "sqlite3"

let screenshotCounter: Map<string, number> = new Map()

export default defineConfig({
    e2e: {
        viewportWidth: 1300,
        viewportHeight: 700,
        screenshotOnRunFailure: false,
        video: false,
        experimentalRunAllSpecs: true,
        setupNodeEvents(on, config) {
            registerCodeCoverageTasks(on, config)

            on("task", {
                queryDb(query) {
                    return new Promise((resolve, reject) => {
                        const db = new sqlite3.Database(config.env.DATABASE_PATH)
                        db.all(query, [], (err, rows) => {
                            if (err) reject(err)
                            else resolve(rows)
                        })
                        db.close()
                    })
                },
                getScreenshotCounter(id: string) {
                    const followUp = screenshotCounter.has(id) ? screenshotCounter.get(id)! + 1 : 1
                    screenshotCounter.set(id, followUp)
                    return followUp
                },
            })

            config.baseUrl = config.env.FRONTEND_URL
            return config
        },
    },
})
