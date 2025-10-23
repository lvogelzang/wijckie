describe("modules page", () => {
    it("shows all modules", () => {
        cy.setCookie("django_language", "en-GB")
        cy.loginByHttpCalls("j.test@wijckie.com")

        // Go to modules
        cy.visit("/modules")
        cy.screenshotForDocs()
    })
})
