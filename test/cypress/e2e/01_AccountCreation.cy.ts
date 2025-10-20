describe("account creation flow", () => {
    it("allow registering a new account", () => {
        cy.setCookie("django_language", "en-GB")

        cy.afterRemoveUser("new-account@wijckie.com").then(() => {
            cy.addVirtualAuthenticator()

            cy.visit("/account/signup/passkey")

            cy.get('[data-cy="emailInput"]').type("new-account{enter}")
            cy.screenshotForDocs("01_AccountCreation", "00_Sign_up", 0)

            cy.get('[data-cy="emailInput"]').type("@wijckie.com{enter}")
            cy.screenshotForDocs("01_AccountCreation", "00_Sign_up", 1)

            cy.getTOTPCodeFromLastEmail().then((code) => {
                cy.get('[data-cy="verificationCodeInput"]').type("!@#$%^{enter}")
                cy.get('[data-cy="verificationCodeInput"]').should("have.attr", "aria-invalid", "true")

                cy.get('[data-cy="verificationCodeInput"]').clear()
                cy.get('[data-cy="verificationCodeInput"]').type(code)
                cy.screenshotForDocs("01_AccountCreation", "00_Sign_up", 2)
                cy.get('[data-cy="verificationCodeInput"]').type("{enter}")
            })

            cy.get("h1").contains("Save Passkey")

            cy.get('[data-cy="nameInput"]').type("{enter}")
            cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")

            cy.intercept(
                {
                    method: "PUT",
                    url: "/_allauth/browser/v1/auth/webauthn/signup",
                    times: 1,
                },
                {
                    statusCode: 500,
                    body: {
                        errors: [
                            {
                                attr: "name",
                                code: "invalid",
                            },
                        ],
                    },
                }
            )

            cy.get('[data-cy="nameInput"]').type("1Simulator")
            cy.get('[data-cy="submitButton"]').click()

            cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
            cy.get('[data-cy="submitButton"]').click()

            cy.get("h1").contains("Dashboard")

            cy.get('[data-cy="menuUsername"]').click()
            cy.get('[data-cy="logoutButton"]').click()
            cy.url().should("include", "/account/authenticate/webauthn")

            cy.visit("/dashboard")
            cy.url().should("include", "/account/authenticate/webauthn?next=%2Fdashboard")
            cy.get('[data-cy="loginButton"]').click()
            cy.get("h1").contains("Dashboard")

            cy.removeVirtualAuthenticator()
        })
    })

    it("supports navigating back to login", () => {
        cy.setCookie("django_language", "en-GB")
        cy.visit("/account/signup/passkey")

        cy.get('[data-cy="toLoginLink"]').click()
        cy.get("h1").contains("Login")
    })
})
