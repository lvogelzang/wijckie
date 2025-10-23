describe("login page", () => {
    it("allows signing in with a sign in code", () => {
        cy.clock(new Date(2026, 1, 1, 18, 0, 0))
        cy.setCookie("django_language", "en-GB")

        // Go to start page
        cy.visit("/")
        cy.screenshotForDocs()

        // Go to sign-in-by-code page
        cy.get('[data-cy="requestCode"]').click()
        cy.screenshotForDocs()

        // Front-end validation error
        cy.get('[data-cy="emailInput"]').type("j.test{enter}")
        cy.get('[data-cy="emailInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()

        // Back-end validation error
        cy.failOnce("POST", "/_allauth/browser/v1/auth/code/request", ["email"])
        cy.get('[data-cy="emailInput"]').type("@wijckie.com")
        cy.get('[data-cy="submitButton"]').click()
        cy.get('[data-cy="emailInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()

        // Request success
        cy.get('[data-cy="submitButton"]').click()
        cy.getTOTPCodeFromLastEmail().then((code) => {
            // Back-end validation error
            cy.get('[data-cy="confirmCodeInput"]').type("!@#$%^{enter}")
            cy.get('[data-cy="confirmCodeInput"]').should("have.attr", "aria-invalid", "true")
            cy.screenshotForDocs()

            // Login success success
            cy.get('[data-cy="confirmCodeInput"]').clear()
            cy.get('[data-cy="confirmCodeInput"]').type(code)
            cy.screenshotForDocs()
            cy.get('[data-cy="confirmCodeInput"]').type("{enter}")
            cy.expectPath("/dashboard")
        })
    })

    it("shows an error when passkey login fails", () => {
        cy.clock(new Date(2026, 1, 1, 18, 0, 0))
        cy.setCookie("django_language", "en-GB")
        cy.addVirtualAuthenticator()

        // Passkey authentication failure
        cy.visit("/")
        cy.get('[data-cy="loginButton"]').click()
        cy.get('[data-cy="errorMessage"]').contains("Something went wrong...")

        cy.removeVirtualAuthenticator()
    })

    it("supports navigating to account creation", () => {
        cy.setCookie("django_language", "en-GB")

        // Navigate to account creation
        cy.visit("/")
        cy.get('[data-cy="signUp"]').click()
        cy.get("h1").contains("Create account")
    })
})
