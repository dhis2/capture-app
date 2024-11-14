import { defineStep as And, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then(/^you see the following (.*)$/, (message) => {
    cy.contains(message);
});

And(/^you see the widget header (.*)$/, (name) => {
    cy.get('[data-test="add-event-enrollment-page-content"]')
        .within(() => {
            cy.get('[data-test="widget-contents"]').should('exist');
            cy.get('[data-test="widget-header"]').should('exist');
            cy.contains(name).should('exist');
        });
});

When('you see the new event form', () => {
    cy.get('[data-test="new-enrollment-event-form"]').should('exist');
});
