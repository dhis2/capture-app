import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given(/^you land on the enrollment (.*) page by having typed (.*)$/, (_, url) => {
    cy.visit(url);
});

Then(/^you see the following (.*)$/, (message) => {
    cy.contains(message);
});

Then(/^you see the widget with data-test (.*)$/, (datatest) => {
    cy.get(`[data-test="${datatest}"]`).should('exist');
});

When(/^you click the widget toggle open close button with data-test (.*)$/, (datatest) => {
    cy.get(`[data-test="${datatest}"]`)
        .within(() => {
            cy.get('[data-test="widget-open-close-toggle-button"]')
                .click();
        });
});
