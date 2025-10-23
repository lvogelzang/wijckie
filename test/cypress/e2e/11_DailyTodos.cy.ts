interface ExpectedDailyTodoItem {
    name: string
}

const expectDailyTodoItems = (dailyTodoItems: ExpectedDailyTodoItem[]) => {
    if (dailyTodoItems.length > 0) {
        cy.get('[data-cy="dailyTodoItem"]').should("have.length", dailyTodoItems.length)
    } else {
        cy.get('[data-cy="dailyTodoItem"]').should("have.length", 1)
        cy.get('[data-cy="dailyTodoItem"] > .text-muted').contains("Geen beschikbaarheden")
    }
    for (let [i, dailyTodoItem] of dailyTodoItems.entries()) {
        const { name } = dailyTodoItem
        cy.get(`[data-cy="dailyTodosWidget"] > :nth-child(${i + 2})`).contains(name)
    }
}

describe("daily todos module", () => {
    it("shows a widget at the dashboard page", () => {
        cy.clock(new Date(2026, 1, 1, 12, 0, 0))
        cy.setCookie("django_language", "en-GB")
        cy.loginByHttpCalls("j.test@wijckie.com")

        // Go to dashboard
        cy.visit("/dashboard")
        cy.get('[data-cy="dailyTodosWidget"]').should("exist")
        expectDailyTodoItems([{ name: "News paper" }, { name: "Social media" }, { name: "Walk" }, { name: "Water" }])
    })

    it("let's a users create a daily todos module", () => {
        cy.setCookie("django_language", "en-GB")
        cy.loginByHttpCalls("j.test@wijckie.com")

        // Go to new module creation
        cy.visit("/modules")
        cy.get('[data-cy="newDailyTodosModuleButton"]').click()
        cy.expectPath("/modules/daily-todos/new")

        // Back-end validation error
        cy.failOnce("POST", "/api/v1/daily-todos-modules/", ["name"])
        cy.get('[data-cy="nameInput"]').type("new-daily-todos-module{enter}")
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()

        // Successful module creation
        cy.get('[data-cy="submitButton"]').click()
        cy.location().should((l) => expect(l.pathname).contains("/modules/daily-todos/"))

        // Update module
        cy.get('[data-cy="nameInput"]').type("new-daily-todos-module-2{enter}")

        // Go to module page
        cy.get('[data-cy="dailyTodosModuleLink"]').first().should("contain", "new-daily-todos-module-2").click()

        // Go to option creation
        cy.get('[data-cy="newDailyTodosOptionButton"]').click()
        cy.reload()

        // Back-end validation error
        cy.failOnce("POST", "/api/v1/daily-todo-options/", ["name", "text"])
        cy.get('[data-cy="nameInput"]').type("Go running")
        cy.get('[data-cy="textInput"]').type("Go for a run")
        cy.get('[data-cy="submitButton"]').click()
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
        cy.get('[data-cy="textInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()

        // Creation success
        cy.get('[data-cy="submitButton"]').click()

        // Go to option creation
        cy.get('[data-cy="newDailyTodosOptionButton"]').click()

        // Creation success
        cy.get('[data-cy="nameInput"]').type("Drink water")
        cy.get('[data-cy="textInput"]').type("Drink 2L water")
        cy.get('[data-cy="submitButton"]').click()

        // Go to widget creation
        cy.get('[data-cy="newDailyTodosWidgetButton"]').click()
        cy.reload()

        // Back-end validation error
        cy.failOnce("POST", "/api/v1/daily-todos-widgets/", ["name"])
        cy.get('[data-cy="nameInput"]').type("My new widget")
        cy.get('[data-cy="submitButton"]').click()
        cy.get('[data-cy="nameInput"]').should("have.attr", "aria-invalid", "true")
        cy.screenshotForDocs()

        // Creation success
        cy.get('[data-cy="submitButton"]').click()

        // Go to widget
        cy.get('[data-cy="dailyTodosWidgetLink"]').first().should("contain", "My new widget").click()

        // Update widget
        cy.get('[data-cy="nameInput"]').clear()
        cy.get('[data-cy="nameInput"]').type("My widget")
        cy.screenshotForDocs()
        cy.get('[data-cy="submitButton"]').click()

        // Delete option
        cy.get('[data-cy="dailyTodosOptionLink"]').first().should("contain", "Drink water").click()
        cy.get('[data-cy="deleteButton"]').click()
        cy.screenshotForDocs()
        cy.get('[data-cy="deleteConfirmationButton"]').click()

        // Delete widget
        cy.get('[data-cy="dailyTodosWidgetLink"]').first().should("contain", "My widget").click()
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
