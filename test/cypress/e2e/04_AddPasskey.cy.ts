describe("add passkey page", () => {
    it("allows registering a new passkey", () => {
        cy.setCookie("django_language", "en-GB")
        cy.addVirtualAuthenticator()

        cy.loginByHttpCalls("j.test@wijckie.com")
        cy.visit("/account/my/passkeys/add")

        cy.get("h1").contains("Add passkey")
        cy.screenshotForDocs("04_AddPasskey", "00_Add_passkey", 0)

        cy.get('[data-cy="nameInput"]').type("{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")

        cy.get('[data-cy="nameInput"]').type("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")

        cy.intercept(
            {
                method: "POST",
                url: "/_allauth/browser/v1/account/authenticators/webauthn",
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

        cy.get('[data-cy="nameInput"]').clear()
        cy.get('[data-cy="nameInput"]').type("1Simulator{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")

        cy.intercept("POST", "/_allauth/browser/v1/account/authenticators/webauthn", (req) => req.continue())
        cy.get('[data-cy="nameInput"]').clear()
        cy.get('[data-cy="nameInput"]').type("1Simulator{enter}")

        cy.expectPath("/account/my")
        cy.get("h1").contains("My account")

        cy.removeVirtualAuthenticator()
    })
})
