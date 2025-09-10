describe("add passkey page", () => {
    it("allows registering a new passkey", () => {
        cy.setCookie("django_language", "en-GB")

        cy.loginByHttpCalls("j.test@wijckie.com")
        cy.visit("/account/my/passkeys/add")

        cy.get("h1").contains("Add passkey")
        cy.screenshotForDocs("04_AddPasskey", "00_Add_passkey", 0)
    })
})
