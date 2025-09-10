interface EmailAddressRow {
    email: string
    verified: boolean
    primary: boolean
}

const expectEmailAddresses = (rows: EmailAddressRow[]) => {
    cy.get('[data-cy="emailAddressRow"]').should("have.length", rows.length)
    rows.forEach((row, index) => {
        cy.get('[data-cy="emailAddressRow"]').eq(index).find('[data-cy="emailValue"]').should("contain", row.email)
        cy.get('[data-cy="emailAddressRow"]')
            .eq(index)
            .find('[data-cy="verifiedValue"]')
            .should("contain", row.verified ? "y" : "n")
        cy.get('[data-cy="emailAddressRow"]')
            .eq(index)
            .find('[data-cy="primaryRadioButton"]')
            .should(row.primary ? "be.checked" : "not.be.checked")
    })
}

describe("my account page", () => {
    it("shows all e-mail addresses", () => {
        cy.setCookie("django_language", "en-GB")

        cy.loginByHttpCalls("j.test@wijckie.com")
        cy.visit("/account/my")

        cy.get("h1").contains("My account")
        cy.screenshotForDocs("02_MyAccount", "00_My_account", 0)
    })

    it("lets users select a primary e-mail address", () => {
        cy.setCookie("django_language", "en-GB")

        cy.setPrimaryEmailAddress("j.test@wijckie.com")
        cy.loginByHttpCalls("j.test@wijckie.com")
        cy.visit("/account/my")

        expectEmailAddresses([
            { email: "j.test@wijckie.com", verified: true, primary: true },
            { email: "j.test-2@wijckie.com", verified: true, primary: false },
        ])

        cy.get('[data-cy="emailAddressRow"]').eq(1).find('[data-cy="primaryRadioButton"]').check()

        expectEmailAddresses([
            { email: "j.test@wijckie.com", verified: true, primary: false },
            { email: "j.test-2@wijckie.com", verified: true, primary: true },
        ])

        cy.setPrimaryEmailAddress("j.test@wijckie.com")
    })

    it("lets users add and verify an e-mail address", () => {
        cy.setCookie("django_language", "en-GB")

        cy.deleteEmailAddress("j.test-3@wijckie.com")
        cy.loginByHttpCalls("j.test@wijckie.com")
        cy.visit("/account/my")

        expectEmailAddresses([
            { email: "j.test@wijckie.com", verified: true, primary: true },
            { email: "j.test-2@wijckie.com", verified: true, primary: false },
        ])

        cy.deleteExistingEmails().then(() => {
            cy.get('[data-cy="addEmailLink"]').click()
            cy.get('[data-cy="emailInput"]').type("j.test-3@wijckie.com{enter}")
            cy.getTOTPCodeFromLastEmail().then((code) => {
                cy.get('[data-cy="verificationCodeInput"]').type(`${code}{enter}`)
                cy.visit("/account/my")
                expectEmailAddresses([
                    { email: "j.test@wijckie.com", verified: true, primary: true },
                    { email: "j.test-2@wijckie.com", verified: true, primary: false },
                    { email: "j.test-3@wijckie.com", verified: true, primary: false },
                ])

                cy.get(':nth-child(3) > :nth-child(4) > [data-cy="deleteButton"]').click()
                expectEmailAddresses([
                    { email: "j.test@wijckie.com", verified: true, primary: true },
                    { email: "j.test-2@wijckie.com", verified: true, primary: false },
                ])
            })
        })
    })

    it("handles navigating to new e-mail address creation page", () => {
        cy.setCookie("django_language", "en-GB")

        cy.loginByHttpCalls("j.test@wijckie.com")
        cy.visit("/account/my")

        cy.get('[data-cy="addEmailLink"]').click()
        cy.url().should("include", "/account/my/email-addresses/add")
    })

    it("handles navigating to new passkey creation page", () => {
        cy.setCookie("django_language", "en-GB")

        cy.loginByHttpCalls("j.test@wijckie.com")
        cy.visit("/account/my")

        cy.get('[data-cy="addPasskeyLink"]').click()
        cy.url().should("include", "/account/my/passkeys/add")
    })
})
