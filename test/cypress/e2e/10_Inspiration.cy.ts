const expectInspirationItem = (text: string) => {
    cy.get('[data-cy="inspirationItem"]').contains(text)
}

describe("inspiration module", () => {
    it("shows a widget at the dashboard page", () => {
        cy.clock(new Date(2026, 1, 1, 12, 0, 0))
        cy.setCookie("django_language", "en-GB")
        cy.loginByHttpCalls("j.test@wijckie.com")

        // Go to dashboard
        cy.visit("/dashboard")
        cy.get('[data-cy="inspirationWidget"]').should("exist")
        expectInspirationItem("The happiness of your life depends on the quality of your thoughts")
    })

    it("let's a users create an inspiration module", () => {
        cy.setCookie("django_language", "en-GB")
        cy.loginByHttpCalls("j.test@wijckie.com")

        // Go to new module creation
        cy.visit("/modules")
        cy.get('[data-cy="newInspirationModuleButton"]').click()
        cy.expectPath("/modules/inspiration/new")

        // Back-end validation error
        cy.failOnce("POST", "/api/v1/inspiration-modules/", ["name"])
        cy.get('[data-cy="nameInput"]').type("new-inspiration-module{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()

        // Successful module creation
        cy.get('[data-cy="submitButton"]').click()
        cy.location().should((l) => expect(l.pathname).contains("/modules/inspiration/"))

        // Update module
        cy.get('[data-cy="nameInput"]').type("new-inspiration-module-2{enter}")

        // Go to module page
        cy.get('[data-cy="inspirationModuleLink"]').first().should("contain", "new-inspiration-module-2").click()

        // Go to option creation
        cy.get('[data-cy="newInspirationOptionButton"]').click()
        cy.reload()

        // Back-end validation error
        cy.failOnce("POST", "/api/v1/inspiration-options/", ["name", "type", "text"])
        cy.get('[data-cy="nameInput"]').type("Text option")
        cy.get('[data-cy="typeSelect"]').click()
        cy.get('[data-cy="textOption"]').click()
        cy.get('[data-cy="textInput"]').type("Text option content!")
        cy.get('[data-cy="submitButton"]').click()
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
        cy.get('[data-cy="typeSelect"]').should("have.attr", "aria-invalid", "true")
        cy.get('[data-cy="textInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()

        // Creation success
        cy.get('[data-cy="submitButton"]').click()

        // Go to option creation
        cy.get('[data-cy="newInspirationOptionButton"]').click()

        // Back-end validation error
        cy.failOnce("POST", "/api/v1/inspiration-options/", ["name", "type", "image"])
        cy.get('[data-cy="nameInput"]').type("Image option")
        cy.get('[data-cy="typeSelect"]').click()
        cy.get('[data-cy="imageOption"]').click()
        cy.get('[data-cy="imageInput"]').selectFile("fixtures/inspiration.jpg")
        cy.get('[data-cy="submitButton"]').click()
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
        cy.get('[data-cy="typeSelect"]').should("have.attr", "aria-invalid", "true")
        cy.get('[data-cy="imageInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()

        // Creation success
        cy.get('[data-cy="submitButton"]').click()

        // Go to widget creation
        cy.get('[data-cy="newInspirationWidgetButton"]').click()
        cy.reload()

        // Back-end validation error
        cy.failOnce("POST", "/api/v1/inspiration-widgets/", ["name"])
        cy.get('[data-cy="nameInput"]').type("My new widget")
        cy.get('[data-cy="submitButton"]').click()
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()

        // Creation success
        cy.get('[data-cy="submitButton"]').click()

        // Go to widget
        cy.get('[data-cy="inspirationWidgetLink"]').first().should("contain", "My new widget").click()

        // Update widget
        cy.get('[data-cy="nameInput"]').clear()
        cy.get('[data-cy="nameInput"]').type("My widget")
        cy.screenshotForDocs()
        cy.get('[data-cy="submitButton"]').click()

        // Delete option
        cy.get('[data-cy="inspirationOptionLink"]').first().should("contain", "Image option").click()
        cy.get('[data-cy="deleteButton"]').click()
        cy.screenshotForDocs()
        cy.get('[data-cy="deleteConfirmationButton"]').click()

        // Delete widget
        cy.get('[data-cy="inspirationWidgetLink"]').first().should("contain", "My widget").click()
        cy.get('[data-cy="deleteButton"]').click()
        cy.screenshotForDocs()
        cy.get('[data-cy="deleteConfirmationButton"]').click()

        // Delete module
        cy.get('[data-cy="deleteButton"]').click()
        cy.screenshotForDocs()
        cy.get('[data-cy="deleteConfirmationButton"]').click()
        cy.expectPath("/modules")
    })
})
