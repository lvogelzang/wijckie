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
        cy.get('[data-cy="submitButton"]').click()
        cy.screenshotForDocs("00_Login", "00_Sign_in_by_code", 3)

        cy.getTOTPCodeFromLastEmail().then((c) => {
            cy.get('[data-cy="confirmCodeInput"]').type(c.toString())
            cy.screenshotForDocs("00_Login", "00_Sign_in_by_code", 4)
            cy.get('[data-cy="confirmCodeInput"]').type("{enter}")
        })
    })

    it("supports navigating to account creation", () => {
        cy.setCookie("django_language", "en-GB")

        cy.visit("/")
        cy.get('[data-cy="signUp"]').click()
        cy.get("h1").contains("Create account")
    })
})
