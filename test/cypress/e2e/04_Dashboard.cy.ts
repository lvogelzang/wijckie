describe("dashboard page", () => {
    it("shows all widgets", () => {
        cy.setCookie("django_language", "en-GB")
        cy.loginByHttpCalls("j.test@wijckie.com")

        // Go to dashboard
        cy.visit("/dashboard")
        cy.screenshotForDocs()
    })
})
