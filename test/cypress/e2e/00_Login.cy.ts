describe("login page", () => {
    it("allows signing in with a sign-in code", () => {
        cy.clock(new Date(2026, 1, 1, 18, 0, 0))
        cy.setCookie("django_language", "en-GB")

        cy.visit("/")
        cy.screenshotForDocs("00_Login", "00_Sign_in_by_code", 0)

        cy.get('[data-cy="requestCode"]').click()
        cy.screenshotForDocs("00_Login", "00_Sign_in_by_code", 1)

        cy.get('[data-cy="emailInput"]').type("j.test{enter}")
        cy.screenshotForDocs("00_Login", "00_Sign_in_by_code", 2)

        cy.get('[data-cy="emailInput"]').type("@wijckie.com")
        cy.intercept(
            {
                method: "POST",
                url: "/_allauth/browser/v1/auth/code/request",
                times: 1,
            },
            {
                statusCode: 400,
                body: { errors: [{ attr: "email", code: "invalid" }] },
            }
        )
        cy.get('[data-cy="submitButton"]').click()
        cy.get('[data-cy="emailInput"]').should("have.attr", "aria-invalid", "true")

        cy.get('[data-cy="emailInput"]').clear()
        cy.get('[data-cy="emailInput"]').type("j.test@wijckie.com{enter}")
        cy.screenshotForDocs("00_Login", "00_Sign_in_by_code", 3)

        cy.getTOTPCodeFromLastEmail().then((code) => {
            cy.get('[data-cy="confirmCodeInput"]').type("!@#$%^{enter}")
            cy.get('[data-cy="confirmCodeInput"]').should("have.attr", "aria-invalid", "true")

            cy.get('[data-cy="confirmCodeInput"]').clear()
            cy.get('[data-cy="confirmCodeInput"]').type(code)

            cy.screenshotForDocs("00_Login", "00_Sign_in_by_code", 4)
            cy.get('[data-cy="confirmCodeInput"]').type("{enter}")

            cy.expectPath("/dashboard")
        })
    })

    it("shows an error when passkey login fails", () => {
        cy.clock(new Date(2026, 1, 1, 18, 0, 0))
        cy.setCookie("django_language", "en-GB")
        cy.addVirtualAuthenticator()

        cy.visit("/")
        cy.get('[data-cy="loginButton"]').click()
        cy.get('[data-cy="errorMessage"]').contains("Something went wrong...")

        cy.removeVirtualAuthenticator()
    })

    it("supports navigating to account creation", () => {
        cy.setCookie("django_language", "en-GB")

        cy.visit("/")
        cy.get('[data-cy="signUp"]').click()
        cy.get("h1").contains("Create account")
    })
})
