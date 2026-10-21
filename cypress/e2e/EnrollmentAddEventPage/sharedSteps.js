import { defineStep as And, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then(/^you see the following (.*)$/, (message) => {
    cy.contains(message);
});

And(/^you see the widget header (.*)$/, (name) => {
    cy.get('[data-test="add-event-enrollment-page-content"]')
        .parent() // widget-contents
        .parent() // widget container (WidgetNonCollapsible)
        .within(() => {
            cy.get('[data-test="widget-contents"]').first().scrollIntoView().should('be.visible');
            cy.get('[data-test="widget-header"]').first().scrollIntoView().should('be.visible');
            cy.contains(name).scrollIntoView().should('be.visible');
        });
});

When('you see the new event form', () => {
    cy.get('[data-test="new-enrollment-event-form"]').first().scrollIntoView().should('be.visible');
});
