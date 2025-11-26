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

        // Go to my account page
        cy.visit("/account/my")
        cy.get("h1").contains("My account")
        expectEmailAddresses([
            { email: "j.test@wijckie.com", verified: true, primary: true },
            { email: "j.test-2@wijckie.com", verified: true, primary: false },
        ])
        cy.screenshotForDocs()
    })

    it("lets users select a primary e-mail address", () => {
        cy.setCookie("django_language", "en-GB")
        cy.setPrimaryEmailAddress("j.test@wijckie.com")
        cy.loginByHttpCalls("j.test@wijckie.com")

        // Go to my account page
        cy.visit("/account/my")
        expectEmailAddresses([
            { email: "j.test@wijckie.com", verified: true, primary: true },
            { email: "j.test-2@wijckie.com", verified: true, primary: false },
        ])

        // Back-end validation error
        cy.failOnce("PATCH", "/_allauth/browser/v1/account/email", [])
        cy.get('[data-cy="emailAddressRow"]').eq(1).find('[data-cy="primaryRadioButton"]').check()
        cy.get('[data-cy="errorDescription"]').should("be.visible")
        cy.get('[data-cy="errorDescription"]').should("contain", "Something went wrong")
        cy.screenshotForDocs()

        // Set primary e-mail address
        cy.get('[data-cy="cancelButton"]').click()
        cy.get('[data-cy="emailAddressRow"]').eq(1).find('[data-cy="primaryRadioButton"]').check()
        expectEmailAddresses([
            { email: "j.test@wijckie.com", verified: true, primary: false },
            { email: "j.test-2@wijckie.com", verified: true, primary: true },
        ])
        cy.screenshotForDocs()

        cy.setPrimaryEmailAddress("j.test@wijckie.com")
    })

    it("lets users add and verify an e-mail address", () => {
        cy.setCookie("django_language", "en-GB")
        cy.deleteEmailAddress("j.test-3@wijckie.com")
        cy.loginByHttpCalls("j.test@wijckie.com")

        // Go to my account page
        cy.visit("/account/my")
        expectEmailAddresses([
            { email: "j.test@wijckie.com", verified: true, primary: true },
            { email: "j.test-2@wijckie.com", verified: true, primary: false },
        ])

        // Go to page to add new e-mail address
        cy.deleteExistingEmails().then(() => {
            cy.get('[data-cy="addEmailLink"]').click()
            cy.expectPath("/account/my/email-addresses/new")
            cy.get("h1").contains("Add e-mail address")
            cy.screenshotForDocs()

            // Front-end validation error
            cy.get('[data-cy="emailInput"]').type("j.test{enter}")
            cy.get('[data-cy="emailInput"]').should("have.attr", "aria-invalid", "true")
            cy.screenshotForDocs()

            // Back-end validation error
            cy.get('[data-cy="emailInput"]').type("@wijckie.com{enter}")
            cy.get('[data-cy="emailInput"]').should("have.attr", "aria-invalid", "true")

            // New address succesful
            cy.get('[data-cy="emailInput"]').clear()
            cy.get('[data-cy="emailInput"]').type("j.test-3@wijckie.com{enter}")
            cy.getTOTPCodeFromLastEmail().then((code) => {
                // Verify address
                cy.get('[data-cy="verificationCodeInput"]').type(`${code}{enter}`)
                cy.visit("/account/my")
                expectEmailAddresses([
                    { email: "j.test@wijckie.com", verified: true, primary: true },
                    { email: "j.test-2@wijckie.com", verified: true, primary: false },
                    { email: "j.test-3@wijckie.com", verified: true, primary: false },
                ])

                // Delete address
                cy.get(':nth-child(3) > :nth-child(4) > [data-cy="deleteButton"]').click()
                expectEmailAddresses([
                    { email: "j.test@wijckie.com", verified: true, primary: true },
                    { email: "j.test-2@wijckie.com", verified: true, primary: false },
                ])
            })
        })
    })

    it("lets users add and verify an e-mail address after navigating back without verifying", () => {
        cy.setCookie("django_language", "en-GB")
        cy.deleteEmailAddress("j.test-3@wijckie.com")
        cy.loginByHttpCalls("j.test@wijckie.com")

        // Go to my account page
        cy.visit("/account/my")
        expectEmailAddresses([
            { email: "j.test@wijckie.com", verified: true, primary: true },
            { email: "j.test-2@wijckie.com", verified: true, primary: false },
        ])

        // Go to page to add new e-mail address
        cy.deleteExistingEmails().then(() => {
            cy.get('[data-cy="addEmailLink"]').click()
            cy.expectPath("/account/my/email-addresses/new")
            cy.get("h1").contains("Add e-mail address")

            // Add new e-mail address
            cy.get('[data-cy="emailInput"]').type("j.test-4@wijckie.com{enter}")

            // Go back to my account page
            cy.visit("/account/my")

            // Back-end validation error
            cy.failOnce("PUT", "/_allauth/browser/v1/account/email", [""])
            cy.get('[data-cy="verifyButton"]').click()
            cy.get('[data-cy="errorDescription"]').should("be.visible")
            cy.get('[data-cy="errorDescription"]').should("contain", "Something went wrong")
            cy.screenshotForDocs()

            // Successful verification request
            cy.get('[data-cy="cancelButton"]').click()
            cy.get('[data-cy="verifyButton"]').click()
            cy.expectPath("/account/verify-email")
            cy.get("h1").contains("Verify e-mail address")

            // Successful e-mail address verification
            cy.getTOTPCodeFromLastEmail().then((code) => {
                cy.get('[data-cy="verificationCodeInput"]').type(`${code}{enter}`)
                cy.visit("/account/my")
                expectEmailAddresses([
                    { email: "j.test@wijckie.com", verified: true, primary: true },
                    { email: "j.test-2@wijckie.com", verified: true, primary: false },
                    { email: "j.test-4@wijckie.com", verified: true, primary: false },
                ])

                // Delete e-mail address
                cy.get(':nth-child(3) > :nth-child(4) > [data-cy="deleteButton"]').click()
                expectEmailAddresses([
                    { email: "j.test@wijckie.com", verified: true, primary: true },
                    { email: "j.test-2@wijckie.com", verified: true, primary: false },
                ])
            })
        })
    })

    it("handles navigating to new passkey creation page", () => {
        cy.setCookie("django_language", "en-GB")
        cy.loginByHttpCalls("j.test@wijckie.com")

        // Go to my account page
        cy.visit("/account/my")

        // Go to passkey addition page
        cy.get('[data-cy="addPasskeyLink"]').click()
        cy.url().should("include", "/account/my/passkeys/new")
    })

    it("allows registering a new passkey", () => {
        cy.setCookie("django_language", "en-GB")
        cy.addVirtualAuthenticator()
        cy.loginByHttpCalls("j.test@wijckie.com")

        // Go to passkey addition page
        cy.visit("/account/my/passkeys/new")
        cy.get("h1").contains("Add passkey")
        cy.screenshotForDocs()

        // Front-end validation error
        cy.get('[data-cy="nameInput"]').type("{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()
        cy.get('[data-cy="nameInput"]').type("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()

        // Back-end validation error
        cy.failOnce("POST", "/_allauth/browser/v1/account/authenticators/webauthn", ["name"])
        cy.get('[data-cy="nameInput"]').clear()
        cy.get('[data-cy="nameInput"]').type("1Simulator{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()

        // Successful passkey addition
        cy.get('[data-cy="nameInput"]').clear()
        cy.get('[data-cy="nameInput"]').type("1Simulator{enter}")
        cy.expectPath("/account/my")
        cy.get("h1").contains("My account")

        // Go to passkey page
        cy.get('[data-cy="passkeyLink"]').first().should("contain", "1Simulator").click()
        cy.location().should((l) => expect(l.pathname).contains("/account/my/passkeys/"))
        cy.screenshotForDocs()

        // Back-end validation error
        cy.failOnce("PUT", "/_allauth/browser/v1/account/authenticators/webauthn", ["name"])
        cy.get('[data-cy="nameInput"]').clear()
        cy.get('[data-cy="nameInput"]').type("2Simulator{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()

        // Successful update of passkey
        cy.get('[data-cy="nameInput"]').clear()
        cy.get('[data-cy="nameInput"]').type("3Simulator{enter}")
        cy.expectPath("/account/my")

        // Delete passkey
        cy.get('[data-cy="passkeyLink"]').first().should("contain", "3Simulator").click()
        cy.location().should((l) => expect(l.pathname).contains("/account/my/passkeys/"))
        cy.get('[data-cy="deleteButton"]').click()
        cy.expectPath("/account/my")

        cy.removeVirtualAuthenticator()
    })
})
