describe("account creation flow", () => {
    it("allow registering a new account", () => {
        cy.setCookie("django_language", "en-GB")

        cy.afterRemoveUser("new-account@wijckie.com").then(() => {
            cy.visit("/account/signup/passkey")

            cy.get('[data-cy="emailInput"]').type("new-account{enter}")
            cy.screenshotForDocs("01_AccountCreation", "00_Sign_up", 0)

            cy.get('[data-cy="emailInput"]').type("@wijckie.com{enter}")
            cy.screenshotForDocs("01_AccountCreation", "00_Sign_up", 1)

            cy.getTOTPCodeFromLastEmail().then((c) => {
                cy.get('[data-cy="verificationCodeInput"]').type(c.toString())
                cy.screenshotForDocs("01_AccountCreation", "00_Sign_up", 2)
                cy.get('[data-cy="verificationCodeInput"]').type("{enter}")
            })

            cy.get('[data-cy="nameInput"]').type("1Simulator")
            cy.get("h1").contains("Save Passkey")
        })
    })

    it("supports navigating back to login", () => {
        cy.setCookie("django_language", "en-GB")
        cy.visit("/account/signup/passkey")

        cy.get('[data-cy="toLoginLink"]').click()
        cy.get("h1").contains("Login")
    })
})
