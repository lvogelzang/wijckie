describe("add e-mail page", () => {
    it("allows registering a new e-mail address", () => {
        cy.setCookie("django_language", "en-GB")

        cy.loginByHttpCalls("j.test@wijckie.com")
        cy.visit("/account/my/email-addresses/add")

        cy.get("h1").contains("Add e-mail address")
        cy.screenshotForDocs("03_AddEmail", "00_Add_email", 0)
    })
})
