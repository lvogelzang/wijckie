export {}

declare global {
    namespace Cypress {
        interface Chainable {
            afterRemoveUser(email: string): Chainable<void>
            loginByHttpCalls(email: string): Chainable<void>
            deleteExistingEmails(): Chainable<void>
            getTOTPCodeFromLastEmail(): Chainable<string>
            screenshotForDocs(): Chainable<void>
            setPrimaryEmailAddress(email: string): Chainable<void>
            deleteEmailAddress(email: string): Chainable<void>
            addVirtualAuthenticator(): Chainable<string>
            removeVirtualAuthenticator(): Chainable<void>
            expectPath(path: string): Chainable<void>
            failOnce(method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE", path: string, invalidFieldIds: string[]): Chainable<void>
        }
    }
}

Cypress.Commands.add("afterRemoveUser", (email: string) => {
    cy.task("queryDb", `DELETE FROM account_emailaddress WHERE email="${email}";`).then((results) => {
        expect(results).to.be.an("array").that.is.empty
    })
    cy.task("queryDb", `DELETE FROM wijckie_models_user WHERE email="${email}";`).then((results) => {
        expect(results).to.be.an("array").that.is.empty
    })
})

Cypress.Commands.add("loginByHttpCalls", (email: string) => {
    cy.deleteExistingEmails().then(() => {
        cy.request(`${Cypress.env("BACKEND_URL")}/api/v1/csrf/`).then((response) => {
            const token = /csrftoken=([^;]*);.*/g.exec(response.headers["set-cookie"][0])![1]
            cy.setCookie("csrftoken", token)
            cy.request({
                url: `${Cypress.env("BACKEND_URL")}/_allauth/browser/v1/auth/code/request`,
                method: "POST",
                headers: { "X-CSRFTOKEN": token },
                body: { email },
                failOnStatusCode: false,
            })
                .its("status")
                .should("be.equal", 401)
                .then(() => {
                    cy.getTOTPCodeFromLastEmail().then((code) => {
                        cy.request({
                            url: `${Cypress.env("BACKEND_URL")}/_allauth/browser/v1/auth/code/confirm`,
                            method: "POST",
                            headers: { "X-CSRFTOKEN": token },
                            body: { code },
                        })
                    })
                })
        })
    })
})

// This is useful to prevent race conditions. Sometimes you're not sure if
// an e-mail is already sent/received/stored so you'll want to wait for that.
// You can achieve this by deleting all stored e-mails, do your action (e.g:
// request your login token), and wait until there is 1 e-mail in your inbox.
Cypress.Commands.add("deleteExistingEmails", () => {
    cy.request({ url: `${Cypress.env("EMAIL_URL")}/api/delete-all`, method: "POST" })
        .its("status")
        .should("be.equal", 200)
})

interface EmailData {
    id: string
    time: number
}

Cypress.Commands.add("getTOTPCodeFromLastEmail", () => {
    cy.request({ url: `${Cypress.env("EMAIL_URL")}/api/messages` })
        .its("body")
        .should("have.length.gte", 1)
        .then((listResponse) => {
            const emails = listResponse as EmailData[]
            emails.sort((a, b) => a.time - b.time)
            const id = emails.pop()!.id
            cy.request({ url: `${Cypress.env("EMAIL_URL")}/api/message/${id}` }).then((emailResponse) => {
                const textBody = emailResponse.body.text
                const regex = new RegExp("([0-9A-Z]{6})")
                const code = regex.exec(textBody)![1]
                return code
            })
        })
})

Cypress.Commands.add("screenshotForDocs", () => {
    const bundleId = Cypress.currentTest.titlePath[0]
    let testId = Cypress.currentTest.titlePath[1]
    testId = testId.replaceAll(" ", "_")
    cy.task("getScreenshotCounter", `${bundleId}__${testId}`).then((followUp) => {
        if (Cypress.env("CAPTURE_SCREENSHOTS")) {
            cy.screenshot(`${testId}__${followUp}`, { overwrite: true })
        }
    })
})

Cypress.Commands.add("setPrimaryEmailAddress", (email: string) => {
    cy.task(
        "queryDb",
        `UPDATE account_emailaddress 
SET "primary" = FALSE
FROM (SELECT user_id FROM account_emailaddress WHERE email="${email}") AS address
WHERE account_emailaddress.user_id = address.user_id;`
    ).then((results) => {
        expect(results).to.be.an("array").that.is.empty
    })
    cy.task(
        "queryDb",
        `UPDATE account_emailaddress 
SET "primary" = TRUE
WHERE email = "${email}";`
    ).then((results) => {
        expect(results).to.be.an("array").that.is.empty
    })
})

Cypress.Commands.add("deleteEmailAddress", (email: string) => {
    cy.task("queryDb", `DELETE FROM account_emailaddress WHERE email="${email}";`).then((results) => {
        expect(results).to.be.an("array").that.is.empty
    })
})

Cypress.Commands.add("addVirtualAuthenticator", () => {
    cy.wrap(
        Cypress.automation("remote:debugger:protocol", {
            command: "WebAuthn.enable",
            params: {},
        }).then(async () => {
            const result = await Cypress.automation("remote:debugger:protocol", {
                command: "WebAuthn.addVirtualAuthenticator",
                params: {
                    options: {
                        protocol: "ctap2",
                        transport: "internal",
                        hasResidentKey: true,
                        hasUserVerification: true,
                        isUserVerified: true,
                        automaticPresenceSimulation: true, //set to true to automatically succeed
                    },
                },
            })
            return result.authenticatorId
        })
    ).as("authenticatorId")
})
Cypress.Commands.add("removeVirtualAuthenticator", () => {
    cy.get("@authenticatorId").then((authenticatorId) => {
        Cypress.automation("remote:debugger:protocol", {
            command: "WebAuthn.removeVirtualAuthenticator",
            params: {
                authenticatorId,
            },
        }).then(() => {
            Cypress.automation("remote:debugger:protocol", {
                command: "WebAuthn.disable",
                params: {},
            })
        })
    })
})

Cypress.Commands.add("expectPath", (path: string) => {
    cy.location().should((l) => expect(l.pathname).to.equal(path))
})

Cypress.Commands.add("failOnce", (method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE", url: string, invalidFieldIds: string[]) => {
    cy.intercept(
        { method, url, times: 1 },
        {
            statusCode: 400,
            body: {
                errors: invalidFieldIds.map((id) => {
                    return { attr: id, code: "invalid" }
                }),
            },
        }
    )
})
