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

        cy.intercept(
            {
                method: "PATCH",
                url: "/_allauth/browser/v1/account/email",
                times: 1,
            },
            { statusCode: 500 }
        )

        cy.get('[data-cy="emailAddressRow"]').eq(1).find('[data-cy="primaryRadioButton"]').check()
        cy.get('[data-cy="errorDescription"]').should("be.visible")
        cy.get('[data-cy="errorDescription"]').should("contain", "Something went wrong")
        cy.get('[data-cy="cancelButton"]').click()

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

            cy.expectPath("/account/my/email-addresses/add")
            cy.get("h1").contains("Add e-mail address")

            cy.get('[data-cy="emailInput"]').type("j.test{enter}")
            cy.get('[data-cy="emailInput"]').should("have.attr", "aria-invalid", "true")

            cy.get('[data-cy="emailInput"]').type("@wijckie.com{enter}")
            cy.get('[data-cy="emailInput"]').should("have.attr", "aria-invalid", "true")

            cy.get('[data-cy="emailInput"]').clear()
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

    it("lets users add and verify an e-mail address after navigating back without verifying", () => {
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

            cy.expectPath("/account/my/email-addresses/add")
            cy.get("h1").contains("Add e-mail address")

            cy.get('[data-cy="emailInput"]').type("j.test-4@wijckie.com{enter}")

            cy.visit("/account/my")

            cy.intercept(
                {
                    method: "PUT",
                    url: "/_allauth/browser/v1/account/email",
                    times: 1,
                },
                { statusCode: 500 }
            )

            cy.get('[data-cy="verifyButton"]').click()
            cy.get('[data-cy="errorDescription"]').should("be.visible")
            cy.get('[data-cy="errorDescription"]').should("contain", "Something went wrong")
            cy.get('[data-cy="cancelButton"]').click()

            cy.get('[data-cy="verifyButton"]').click()
            cy.expectPath("/account/verify-email")
            cy.get("h1").contains("Verify e-mail address")

            cy.getTOTPCodeFromLastEmail().then((code) => {
                cy.get('[data-cy="verificationCodeInput"]').type(`${code}{enter}`)
                cy.visit("/account/my")
                expectEmailAddresses([
                    { email: "j.test@wijckie.com", verified: true, primary: true },
                    { email: "j.test-2@wijckie.com", verified: true, primary: false },
                    { email: "j.test-4@wijckie.com", verified: true, primary: false },
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

    it("allows registering a new passkey", () => {
        cy.setCookie("django_language", "en-GB")
        cy.addVirtualAuthenticator()

        cy.loginByHttpCalls("j.test@wijckie.com")
        cy.visit("/account/my/passkeys/add")

        cy.get("h1").contains("Add passkey")
        cy.screenshotForDocs("04_AddPasskey", "00_Add_passkey", 0)

        cy.get('[data-cy="nameInput"]').type("{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")

        cy.get('[data-cy="nameInput"]').type("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")

        cy.intercept(
            {
                method: "POST",
                url: "/_allauth/browser/v1/account/authenticators/webauthn",
                times: 1,
            },
            {
                statusCode: 500,
                body: { errors: [{ attr: "name", code: "invalid" }] },
            }
        )

        cy.get('[data-cy="nameInput"]').clear()
        cy.get('[data-cy="nameInput"]').type("1Simulator{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")

        cy.intercept("POST", "/_allauth/browser/v1/account/authenticators/webauthn", (req) => req.continue())
        cy.get('[data-cy="nameInput"]').clear()
        cy.get('[data-cy="nameInput"]').type("1Simulator{enter}")

        cy.expectPath("/account/my")
        cy.get("h1").contains("My account")

        cy.get('[data-cy="passkeyLink"]').first().click()
        cy.location().should((l) => expect(l.pathname).contains("/account/my/passkeys/"))

        cy.intercept(
            {
                method: "PUT",
                url: "_allauth/browser/v1/account/authenticators/webauthn",
                times: 1,
            },
            {
                statusCode: 400,
                body: { errors: [{ attr: "name", code: "invalid" }] },
            }
        )

        cy.get('[data-cy="nameInput"]').clear()
        cy.get('[data-cy="nameInput"]').type("2Simulator{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")

        cy.get('[data-cy="nameInput"]').clear()
        cy.get('[data-cy="nameInput"]').type("3Simulator{enter}")
        cy.expectPath("/account/my")

        cy.get('[data-cy="passkeyLink"]').first().click()
        cy.location().should((l) => expect(l.pathname).contains("/account/my/passkeys/"))
        cy.get('[data-cy="deleteButton"]').click()

        cy.expectPath("/account/my")

        cy.removeVirtualAuthenticator()
    })
})
