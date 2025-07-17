import { defineConfig } from "orval"

export default defineConfig({
    allAuth: {
        output: {
            mode: "split",
            target: "src/api/endpoints/allauth.ts",
            schemas: "src/api/models/allauth",
            client: "react-query",
            mock: true,
            prettier: true,
            override: {
                mutator: {
                    path: "src/helpers/api.ts",
                    name: "customInstance",
                },
            },
        },
        input: {
            target: "http://localhost:8000/_allauth/openapi.yaml",
        },
    },
    api: {
        output: {
            mode: "split",
            target: "src/api/endpoints/api.ts",
            schemas: "src/api/models/api",
            client: "react-query",
            mock: true,
            prettier: true,
            override: {
                mutator: {
                    path: "src/helpers/api.ts",
                    name: "customInstance",
                },
            },
        },
        input: {
            target: "http://localhost:8000/api/v1/schema/",
        },
    },
})
