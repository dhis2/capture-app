import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';

When('you set the assignee filter to anyone', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Assigned to')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Anyone')
        .click();
});

Then('the assigned to filter button should show that the anyone filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Assigned to: Anyone')
        .should('exist');
});
