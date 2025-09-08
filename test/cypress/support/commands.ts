export {}

declare global {
    namespace Cypress {
        interface Chainable {
            afterRemoveUser(email: string): Chainable<void>
            getTOTPCodeFromLastEmail(): Chainable<number>
            screenshotForDocs(file: string, test: string, followUpNumber: number): Chainable<void>
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

interface EmailData {
    id: string
    time: number
}

Cypress.Commands.add("getTOTPCodeFromLastEmail", () => {
    cy.request({ url: `${Cypress.env("EMAIL_URL")}/api/messages` }).then((listResponse) => {
        const emails = listResponse.body as EmailData[]
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

Cypress.Commands.add("screenshotForDocs", (file: string, test: string, followUpNumber: number) => {
    if (Cypress.env("CAPTURE_SCREENSHOTS")) {
        cy.screenshot(`${file}__${test}__${followUpNumber}`, { overwrite: true })
    }
})
