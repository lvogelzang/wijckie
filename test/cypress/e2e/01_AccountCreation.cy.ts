describe("account creation flow", () => {
    it("allow registering a new account", () => {
        cy.setCookie("django_language", "en-GB")
        cy.addVirtualAuthenticator()

        cy.afterRemoveUser("new-account@wijckie.com").then(() => {
            // Go to sign up page
            cy.visit("/account/signup/passkey")
            cy.screenshotForDocs()

            // Front-end validation error
            cy.get('[data-cy="emailInput"]').type("new-account{enter}")
            cy.screenshotForDocs()

            // Back-end validation error
            cy.failOnce("POST", "/_allauth/browser/v1/auth/webauthn/signup", ["email"])
            cy.get('[data-cy="emailInput"]').clear()
            cy.get('[data-cy="emailInput"]').type("new-account@wijckie.com{enter}")
            cy.get('[data-cy="emailInput"]').should("have.attr", "aria-invalid", "true")
            cy.screenshotForDocs()

            // Account creation success
            cy.get('[data-cy="submitButton"]').click()
            cy.getTOTPCodeFromLastEmail().then((code) => {
                // Back-end validation error
                cy.get('[data-cy="verificationCodeInput"]').type("!@#$%^{enter}")
                cy.get('[data-cy="verificationCodeInput"]').should("have.attr", "aria-invalid", "true")
                cy.screenshotForDocs()

                // Account verification success
                cy.get('[data-cy="verificationCodeInput"]').clear()
                cy.get('[data-cy="verificationCodeInput"]').type(code)
                cy.screenshotForDocs()
                cy.get('[data-cy="verificationCodeInput"]').type("{enter}")
            })

            // Front-end validation error
            cy.get("h1").contains("Save Passkey")
            cy.get('[data-cy="nameInput"]').type("{enter}")
            cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
            cy.screenshotForDocs()

            // Back-end validation error
            cy.failOnce("PUT", "/_allauth/browser/v1/auth/webauthn/signup", ["name"])
            cy.get('[data-cy="nameInput"]').type("1Simulator")
            cy.get('[data-cy="submitButton"]').click()
            cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
            cy.screenshotForDocs()

            // Passkey creation success
            cy.get('[data-cy="submitButton"]').click()
            cy.get("h1").contains("Dashboard")

            // Logout
            cy.get('[data-cy="menuUsername"]').click()
            cy.get('[data-cy="logoutButton"]').click()
            cy.url().should("include", "/account/authenticate/webauthn")

            // Redirect when trying to access private content
            cy.visit("/dashboard")
            cy.url().should("include", "/account/authenticate/webauthn?next=%2Fdashboard")

            // Log in using passkey
            cy.get('[data-cy="loginButton"]').click()
            cy.get("h1").contains("Dashboard")

            cy.removeVirtualAuthenticator()
        })
    })

    it("supports navigating back to login", () => {
        cy.setCookie("django_language", "en-GB")

        // Go to sign up page
        cy.visit("/account/signup/passkey")

        // Go back to login page
        cy.get('[data-cy="toLoginLink"]').click()
        cy.get("h1").contains("Login")
    })
})
